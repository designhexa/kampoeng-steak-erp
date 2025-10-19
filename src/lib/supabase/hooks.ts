import { useEffect, useState } from 'react'
import { db, supabase } from './index'
import type { Database } from './database.types'
import type { Session, User } from '@supabase/supabase-js'

type Tables = Database['public']['Tables']
type TableName = keyof Tables

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get session from storage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { session, user, loading }
}

export function useQuery<T extends TableName>(
  table: T,
  options?: {
    filter?: Partial<Tables[T]['Row']>
    orderBy?: keyof Tables[T]['Row']
    orderDirection?: 'asc' | 'desc'
    limit?: number
  }
) {
  const [data, setData] = useState<Tables[T]['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await db.findMany(table, options)
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [table, options?.filter, options?.orderBy, options?.orderDirection, options?.limit])

  return { data, loading, error }
}

export function useMutation<T extends TableName>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const create = async (table: T, data: Tables[T]['Insert']) => {
    setLoading(true)
    try {
      const result = await db.create(table, data)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const update = async (table: T, id: number, data: Tables[T]['Update']) => {
    setLoading(true)
    try {
      const result = await db.update(table, id, data)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const remove = async (table: T, id: number) => {
    setLoading(true)
    try {
      await db.delete(table, id)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    create,
    update,
    remove,
    loading,
    error
  }
}

export function useSubscription<T extends TableName>(
  table: T,
  callback: (payload: {
    new: Tables[T]['Row'] | null
    old: Tables[T]['Row'] | null
  }) => void
) {
  useEffect(() => {
    const subscription = supabase
      .channel('table_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        (payload) => {
          callback({
            new: payload.new as Tables[T]['Row'],
            old: payload.old as Tables[T]['Row']
          })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [table, callback])
}