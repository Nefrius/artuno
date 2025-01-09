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
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          daily_predictions_left: number
          total_predictions: number
          last_prediction_date: string | null
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          daily_predictions_left?: number
          total_predictions?: number
          last_prediction_date?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          daily_predictions_left?: number
          total_predictions?: number
          last_prediction_date?: string | null
        }
      }
      predictions: {
        Row: {
          id: string
          user_id: string
          coin_id: string
          prediction_date: string
          target_date: string
          predicted_price: number
          actual_price: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          coin_id: string
          prediction_date: string
          target_date: string
          predicted_price: number
          actual_price?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          coin_id?: string
          prediction_date?: string
          target_date?: string
          predicted_price?: number
          actual_price?: number | null
          created_at?: string
        }
      }
    }
  }
} 