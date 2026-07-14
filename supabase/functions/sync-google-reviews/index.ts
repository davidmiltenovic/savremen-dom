import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GoogleReview {
  author_name: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlacesResponse {
  result?: {
    reviews?: GoogleReview[];
    rating?: number;
    user_ratings_total?: number;
  };
  status: string;
  error_message?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");
    const GOOGLE_PLACE_ID = Deno.env.get("GOOGLE_PLACE_ID");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!GOOGLE_API_KEY || !GOOGLE_PLACE_ID) {
      throw new Error("Missing Google API credentials");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_API_KEY}`;

    const googleResponse = await fetch(googleApiUrl);

    if (!googleResponse.ok) {
      throw new Error(`Google API request failed: ${googleResponse.status}`);
    }

    const googleData: GooglePlacesResponse = await googleResponse.json();

    if (googleData.status !== "OK") {
      throw new Error(`Google API error: ${googleData.status} - ${googleData.error_message || "Unknown error"}`);
    }

    const reviews = googleData.result?.reviews || [];

    if (reviews.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No new reviews found",
          count: 0
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const reviewsToUpsert = reviews.map((review: GoogleReview) => ({
      author_name: review.author_name,
      author_photo_url: review.profile_photo_url || null,
      rating: review.rating,
      text: review.text,
      time: review.time,
      relative_time_description: review.relative_time_description,
      language: review.language || null,
    }));

    const { data, error: upsertError } = await supabase
      .from("google_reviews")
      .upsert(reviewsToUpsert, {
        onConflict: "author_name,time",
        ignoreDuplicates: false,
      })
      .select();

    if (upsertError) {
      throw new Error(`Failed to upsert reviews: ${upsertError.message}`);
    }

    const { count: totalCount } = await supabase
      .from("google_reviews")
      .select("*", { count: "exact", head: true });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Reviews synced successfully",
        synced: data?.length || 0,
        total: totalCount || 0,
        rating: googleData.result?.rating,
        total_ratings: googleData.result?.user_ratings_total,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error syncing reviews:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
