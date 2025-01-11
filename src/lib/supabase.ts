import { createClient } from '@supabase/supabase-js'

export type UserRole = 'user' | 'admin'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  notifications_enabled: boolean
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getUserRole(userId: string): Promise<UserRole> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !data) return 'user'
  return data.role
}

export async function createNotification(notification: Omit<Notification, 'id' | 'created_at'>) {
  return await supabase
    .from('notifications')
    .insert([notification])
}

export async function getNotifications(userId: string) {
  return await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function markNotificationAsRead(notificationId: string) {
  return await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
}

export async function deleteUserAccount(userId: string) {
  return await supabase
    .from('user_profiles')
    .delete()
    .eq('id', userId)
} 