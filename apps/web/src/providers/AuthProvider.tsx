import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CredentialResponse } from '@react-oauth/google'

import { apiClient } from '../lib/apiClient'

const STORAGE_KEY = 'fehub.auth.user'

type AuthUser = {
  id: string
  name: string
  email: string
  picture?: string
  credential: string
}

type AuthContextValue = {
  user: AuthUser | null
  signInWithGoogle: (response: CredentialResponse) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const decodeBase64 = (value: string) => {
  const binary = atob(value)
  if (typeof TextDecoder !== 'undefined') {
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  }

  let result = ''
  for (let i = 0; i < binary.length; i += 1) {
    result += String.fromCharCode(binary.charCodeAt(i))
  }

  try {
    return decodeURIComponent(escape(result))
  } catch {
    return result
  }
}

const decodeCredential = (credential: string): AuthUser | null => {
  try {
    const [, payload] = credential.split('.')
    if (!payload) {
      return null
    }
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded =
      normalized.length % 4 === 0
        ? normalized
        : normalized.padEnd(normalized.length + (4 - (normalized.length % 4)), '=')
    const decoded = decodeBase64(padded)

    const data = JSON.parse(decoded) as {
      sub?: string
      name?: string
      given_name?: string
      email?: string
      picture?: string
    }

    if (!data.sub) {
      return null
    }

    return {
      id: data.sub,
      name: data.name ?? data.given_name ?? 'Google User',
      email: data.email ?? '',
      picture: data.picture,
      credential,
    }
  } catch (error) {
    console.error('Failed to decode Google credential', error)
    return null
  }
}

const readInitialUser = (): AuthUser | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return null
    }
    return JSON.parse(stored) as AuthUser
  } catch (error) {
    console.warn('Failed to parse stored auth user', error)
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => readInitialUser())

  const signInWithGoogle = useCallback(async (response: CredentialResponse) => {
    if (!response.credential) {
      return false
    }

    const decoded = decodeCredential(response.credential)
    if (!decoded) {
      return false
    }

    if (!decoded.email) {
      console.error('Google credential does not include an email address')
      return false
    }

    try {
      await apiClient.syncUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      })
    } catch (error) {
      console.error('Failed to sync user profile', error)
      return false
    }

    setUser(decoded)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(decoded))
    }
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      signInWithGoogle,
      logout,
    }),
    [logout, signInWithGoogle, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
