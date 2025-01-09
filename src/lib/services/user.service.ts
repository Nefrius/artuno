import { supabase } from '../supabase'
import { User } from 'firebase/auth'
import { Database } from '../database.types'

type UserRow = Database['public']['Tables']['users']['Row']

export const createOrUpdateUser = async (firebaseUser: User): Promise<UserRow> => {
  try {
    if (!firebaseUser.email) {
      throw new Error('Kullanıcı e-posta adresi bulunamadı')
    }

    const userData = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      daily_predictions_left: 5,
      total_predictions: 0,
      last_prediction_date: null
    }

    const { data, error } = await supabase
      .from('users')
      .upsert(userData)
      .select('*')
      .single()

    if (error) {
      console.error('Supabase upsert hatası:', JSON.stringify(error, null, 2))
      throw error
    }

    if (!data) {
      throw new Error('Kullanıcı verisi oluşturulamadı')
    }

    return data
  } catch (error) {
    console.error('createOrUpdateUser hatası:', JSON.stringify(error, null, 2))
    throw error
  }
}

export const getUserData = async (userId: string): Promise<UserRow> => {
  try {
    // Önce kullanıcıyı kontrol et
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    // Kullanıcı bulunamadıysa yeni oluştur
    if (fetchError?.code === 'PGRST116') {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: 'unknown@email.com', // Geçici e-posta
          daily_predictions_left: 5,
          total_predictions: 0
        })
        .select('*')
        .single()

      if (createError) {
        console.error('Yeni kullanıcı oluşturma hatası:', JSON.stringify(createError, null, 2))
        throw createError
      }

      return newUser!
    }

    if (fetchError) {
      console.error('Supabase select hatası:', JSON.stringify(fetchError, null, 2))
      throw fetchError
    }

    return existingUser
  } catch (error) {
    console.error('getUserData hatası:', JSON.stringify(error, null, 2))
    throw error
  }
}

export const updateDailyPredictions = async (userId: string, newCount: number): Promise<UserRow> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        daily_predictions_left: newCount,
        last_prediction_date: new Date().toISOString()
      })
      .eq('id', userId)
      .select('*')
      .single()

    if (error) {
      console.error('Supabase update hatası:', JSON.stringify(error, null, 2))
      throw error
    }

    if (!data) {
      throw new Error('Kullanıcı güncellenemedi')
    }

    return data
  } catch (error) {
    console.error('updateDailyPredictions hatası:', JSON.stringify(error, null, 2))
    throw error
  }
}

export const incrementTotalPredictions = async (userId: string): Promise<UserRow> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        total_predictions: supabase.rpc('increment')
      })
      .eq('id', userId)
      .select('*')
      .single()

    if (error) {
      console.error('Supabase increment hatası:', JSON.stringify(error, null, 2))
      throw error
    }

    if (!data) {
      throw new Error('Kullanıcı güncellenemedi')
    }

    return data
  } catch (error) {
    console.error('incrementTotalPredictions hatası:', JSON.stringify(error, null, 2))
    throw error
  }
}

export const searchUsers = async (query: string): Promise<UserRow[]> => {
  try {
    const cleanQuery = query.trim().toLowerCase()
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .or(
        `email.ilike.%${cleanQuery}%,` +
        `email.ilike.${cleanQuery}%,` +
        `email.ilike.%${cleanQuery}`
      )
      .limit(5)

    if (error) {
      console.error('Kullanıcı arama hatası:', error)
      throw error
    }

    // Sonuçları sırala: Tam eşleşenler önce
    const sortedUsers = (users || []).sort((a, b) => {
      const aEmail = a.email.toLowerCase()
      const bEmail = b.email.toLowerCase()
      
      // Tam eşleşme kontrolü
      if (aEmail === cleanQuery) return -1
      if (bEmail === cleanQuery) return 1
      
      // Başlangıç eşleşmesi kontrolü
      if (aEmail.startsWith(cleanQuery) && !bEmail.startsWith(cleanQuery)) return -1
      if (bEmail.startsWith(cleanQuery) && !aEmail.startsWith(cleanQuery)) return 1
      
      return 0
    })

    return sortedUsers
  } catch (error) {
    console.error('searchUsers hatası:', error)
    throw error
  }
} 