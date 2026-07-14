import { useEffect, useState } from 'react';
import { Star, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Review {
  id: string;
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
  language: string | null;
}

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('google_reviews')
        .select('*')
        .order('time', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const syncReviews = async () => {
    setSyncing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-google-reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to sync reviews');
      }

      await fetchReviews();

      if (result.synced > 0) {
        setSuccessMessage(`Sinhronizovano ${result.synced} novih recenzija. Ukupno: ${result.total}`);
      } else {
        setSuccessMessage(`Nema novih recenzija. Ukupno: ${result.total}`);
      }
    } catch (err) {
      console.error('Error syncing reviews:', err);
      setError(err instanceof Error ? err.message : 'Greška pri sinhronizaciji recenzija');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Šta naši klijenti kažu
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(Number(averageRating))
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {averageRating}
              </span>
              <span className="text-gray-600">
                ({reviews.length} {reviews.length === 1 ? 'recenzija' : 'recenzija'})
              </span>
            </div>
          )}
          <button
            onClick={syncReviews}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sinhronizacija...' : 'Osvježi recenzije'}
          </button>
          {error && (
            <p className="mt-4 text-red-600 text-sm">{error}</p>
          )}
          {successMessage && (
            <p className="mt-4 text-green-600 text-sm">{successMessage}</p>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Nema dostupnih recenzija</p>
            <button
              onClick={syncReviews}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
              Učitaj recenzije
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start gap-4 mb-4">
                  {review.author_photo_url ? (
                    <img
                      src={review.author_photo_url}
                      alt={review.author_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {review.author_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {review.author_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {review.relative_time_description}
                    </p>
                  </div>
                </div>

                <div className="mb-3">{renderStars(review.rating)}</div>

                <p className="text-gray-700 text-sm leading-relaxed line-clamp-6">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJzx4fDCQhV0cRUErlz1eSd1E"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Pogledaj sve recenzije na Google Maps
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
