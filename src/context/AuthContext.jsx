/* global pendo */
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        pendo.identify({
          visitor: {
            id: currentUser.id,
            email: currentUser.email,
            createdAt: currentUser.created_at,
            lastSignInAt: currentUser.last_sign_in_at,
            role: currentUser.role,
            emailConfirmedAt: currentUser.email_confirmed_at,
            isAnonymous: currentUser.is_anonymous
          }
        })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        pendo.identify({
          visitor: {
            id: currentUser.id,
            email: currentUser.email,
            createdAt: currentUser.created_at,
            lastSignInAt: currentUser.last_sign_in_at,
            role: currentUser.role,
            emailConfirmedAt: currentUser.email_confirmed_at,
            isAnonymous: currentUser.is_anonymous
          }
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    pendo.clearSession()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
