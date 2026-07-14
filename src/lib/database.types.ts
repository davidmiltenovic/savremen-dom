export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'super_admin' | 'agent'
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'super_admin' | 'agent'
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'super_admin' | 'agent'
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          code: string
          title: string
          property_type: 'stan' | 'kuća' | 'poslovni_prostor' | 'zemljište' | 'garaža'
          subcategory: string | null
          transaction_type: 'prodaja' | 'izdavanje'
          price: number
          price_per_m2: number | null
          area: number
          rooms: number | null
          floor: number | null
          total_floors: number | null
          year_built: number | null
          registered: boolean
          heating: string | null
          has_elevator: boolean
          parking: string | null
          has_terrace: boolean
          has_balcony: boolean
          has_basement: boolean
          has_yard: boolean
          furnished: 'namešteno' | 'polunamešteno' | 'prazno' | null
          status: 'aktivno' | 'rezervisano' | 'prodato'
          featured: boolean
          city: string
          municipality: string | null
          street: string | null
          hide_exact_address: boolean
          latitude: number | null
          longitude: number | null
          description: string | null
          video_url: string | null
          tour_3d_url: string | null
          meta_title: string | null
          meta_description: string | null
          slug: string
          views: number
          agent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code?: string
          title: string
          property_type: 'stan' | 'kuća' | 'poslovni_prostor' | 'zemljište' | 'garaža'
          subcategory?: string | null
          transaction_type: 'prodaja' | 'izdavanje'
          price: number
          price_per_m2?: number | null
          area: number
          rooms?: number | null
          floor?: number | null
          total_floors?: number | null
          year_built?: number | null
          registered?: boolean
          heating?: string | null
          has_elevator?: boolean
          parking?: string | null
          has_terrace?: boolean
          has_balcony?: boolean
          has_basement?: boolean
          has_yard?: boolean
          furnished?: 'namešteno' | 'polunamešteno' | 'prazno' | null
          status?: 'aktivno' | 'rezervisano' | 'prodato'
          featured?: boolean
          city: string
          municipality?: string | null
          street?: string | null
          hide_exact_address?: boolean
          latitude?: number | null
          longitude?: number | null
          description?: string | null
          video_url?: string | null
          tour_3d_url?: string | null
          meta_title?: string | null
          meta_description?: string | null
          slug: string
          views?: number
          agent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          property_type?: 'stan' | 'kuća' | 'poslovni_prostor' | 'zemljište' | 'garaža'
          subcategory?: string | null
          transaction_type?: 'prodaja' | 'izdavanje'
          price?: number
          price_per_m2?: number | null
          area?: number
          rooms?: number | null
          floor?: number | null
          total_floors?: number | null
          year_built?: number | null
          registered?: boolean
          heating?: string | null
          has_elevator?: boolean
          parking?: string | null
          has_terrace?: boolean
          has_balcony?: boolean
          has_basement?: boolean
          has_yard?: boolean
          furnished?: 'namešteno' | 'polunamešteno' | 'prazno' | null
          status?: 'aktivno' | 'rezervisano' | 'prodato'
          featured?: boolean
          city?: string
          municipality?: string | null
          street?: string | null
          hide_exact_address?: boolean
          latitude?: number | null
          longitude?: number | null
          description?: string | null
          video_url?: string | null
          tour_3d_url?: string | null
          meta_title?: string | null
          meta_description?: string | null
          slug?: string
          views?: number
          agent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          url: string
          is_main: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          url: string
          is_main?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          url?: string
          is_main?: boolean
          order_index?: number
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          property_id: string | null
          name: string
          email: string | null
          phone: string
          message: string | null
          lead_type: 'upit' | 'obilazak'
          status: 'novi' | 'kontaktiran' | 'zakazan_obilazak' | 'ponuda_poslata' | 'zatvoreno'
          assigned_agent_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          name: string
          email?: string | null
          phone: string
          message?: string | null
          lead_type: 'upit' | 'obilazak'
          status?: 'novi' | 'kontaktiran' | 'zakazan_obilazak' | 'ponuda_poslata' | 'zatvoreno'
          assigned_agent_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          name?: string
          email?: string | null
          phone?: string
          message?: string | null
          lead_type?: 'upit' | 'obilazak'
          status?: 'novi' | 'kontaktiran' | 'zakazan_obilazak' | 'ponuda_poslata' | 'zatvoreno'
          assigned_agent_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
