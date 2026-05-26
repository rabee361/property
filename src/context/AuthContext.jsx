import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../lib/api'

const AUTH_STORAGE_KEY = 'propertyAuth'

const AuthContext = createContext(null)

function readStoredAuth() {
  const storedValue = localStorage.getItem(AUTH_STORAGE_KEY)

  if (!storedValue) {
    return null
  }

  try {
    return JSON.parse(storedValue)
  } catch {
    return null
  }
}

function persistAuthState(authState) {
  if (!authState) {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState))
}

function normalizeUser(user, fallbackEmail) {
  if (!user) {
    return null
  }

  return {
    ...user,
    email: user.email || fallbackEmail || '',
  }
}

async function fetchCurrentProfile(token) {
  const response = await apiRequest('/api/profile/me', {
    token,
  })

  return response?.profile || null
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => readStoredAuth())
  const [isInitializing, setIsInitializing] = useState(true)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  useEffect(() => {
    persistAuthState(authState)
  }, [authState])

  useEffect(() => {
    setIsInitializing(false)
  }, [])

  useEffect(() => {
    if (authState?.accountType !== 'user' || !authState?.token) {
      setIsLoadingProfile(false)
      return
    }

    let isMounted = true

    const loadProfile = async () => {
      setIsLoadingProfile(true)

      try {
        const profile = await fetchCurrentProfile(authState.token)

        if (isMounted) {
          setAuthState((currentState) => {
            if (!currentState || currentState.accountType !== 'user' || currentState.token !== authState.token) {
              return currentState
            }

            return {
              ...currentState,
              profile,
            }
          })
        }
      } catch (error) {
        if (isMounted && error.status === 401) {
          setAuthState(null)
        }
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false)
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [authState?.accountType, authState?.token])

  const saveAuthState = ({ accountType, token, user, profile }) => {
    setAuthState({
      accountType,
      token,
      user,
      profile: profile || null,
    })
  }

  const loginUser = async ({ email, password }) => {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      data: { email, password },
    })

    if (!response?.success || !response?.token) {
      throw new Error(response?.message || 'Login failed')
    }

    const user = normalizeUser(response.user, email)
    const profile = await fetchCurrentProfile(response.token)

    saveAuthState({
      accountType: 'user',
      token: response.token,
      user,
      profile,
    })

    return { user }
  }

  const loginAdmin = async ({ email, password }) => {
    const response = await apiRequest('/api/admin/auth/login', {
      method: 'POST',
      data: { email, password },
    })

    if (!response?.success || !response?.token) {
      throw new Error(response?.message || 'Admin login failed')
    }

    const user = normalizeUser(response.user, email)
    saveAuthState({
      accountType: 'admin',
      token: response.token,
      user,
      profile: null,
    })

    return { user }
  }

  const registerOwner = async ({
    name,
    email,
    phone,
    password,
  }) => {
    const registerResponse = await apiRequest('/api/auth/register', {
      method: 'POST',
      data: {
        name,
        email,
        phone,
        password,
      },
    })

    const token = registerResponse?.token

    if (!token || !registerResponse?.user) {
      throw new Error('Registration failed')
    }

    const user = normalizeUser(registerResponse.user, email)
    saveAuthState({
      accountType: 'user',
      token,
      user,
      profile: null,
    })

    return {
      user,
      profile: null,
    }
  }

  const createProfile = async ({
    fullName,
    nationalNumber,
    idCardImage,
    birthday,
    city,
  }) => {
    if (!authState?.token || authState.accountType !== 'user') {
      throw new Error('You must be logged in as an owner to create a profile.')
    }

    const profileData = new FormData()
    profileData.append('full_name', fullName)
    profileData.append('national_number', nationalNumber)
    profileData.append('id_card_photo', idCardImage)
    profileData.append('city', city)

    if (birthday) {
      profileData.append('date_of_birth', birthday)
    }

    const response = await apiRequest('/api/profile/add', {
      method: 'POST',
      token: authState.token,
      data: profileData,
    })

    setAuthState((currentState) => {
      if (!currentState) {
        return currentState
      }

      return {
        ...currentState,
        profile: response?.profile || null,
      }
    })

    return response?.profile || null
  }

  const saveProfileChanges = async ({
    profileId,
    fullName,
    nationalNumber,
    idCardImage,
    birthday,
    city,
  }) => {
    if (!authState?.token || authState.accountType !== 'user') {
      throw new Error('You must be logged in as an owner to update a profile.')
    }

    if (!profileId) {
      throw new Error('A profile must exist before it can be updated.')
    }

    const profileData = new FormData()
    profileData.append('full_name', fullName)
    profileData.append('national_number', nationalNumber)
    profileData.append('city', city)
    profileData.append('date_of_birth', birthday || '')

    if (idCardImage instanceof File) {
      profileData.append('id_card_photo', idCardImage)
    }

    const response = await apiRequest(`/api/profile/update/${profileId}`, {
      method: 'POST',
      token: authState.token,
      data: profileData,
    })

    setAuthState((currentState) => {
      if (!currentState) {
        return currentState
      }

      return {
        ...currentState,
        profile: response?.profile || currentState.profile,
      }
    })

    return response?.profile || null
  }

  const updateProfile = (profile) => {
    setAuthState((currentState) => {
      if (!currentState) {
        return currentState
      }

      return {
        ...currentState,
        profile,
      }
    })
  }

  const updateUser = (updates) => {
    setAuthState((currentState) => {
      if (!currentState) {
        return currentState
      }

      return {
        ...currentState,
        user: {
          ...currentState.user,
          ...updates,
        },
      }
    })
  }

  const logout = () => {
    const currentAuthState = authState

    const performLogout = async () => {
      try {
        if (currentAuthState?.token && currentAuthState?.accountType) {
          const path =
            currentAuthState.accountType === 'admin'
              ? '/api/admin/auth/logout'
              : '/api/auth/logout'

          await apiRequest(path, {
            method: 'POST',
            token: currentAuthState.token,
          })
        }
      } finally {
        setAuthState(null)
      }
    }

    return performLogout()
  }

  const changePassword = async ({ newPassword, confirmPassword }) => {
    const currentAuthState = authState

    if (!currentAuthState?.token || !currentAuthState?.accountType) {
      throw new Error('You must be logged in to change your password.')
    }

    const path =
      currentAuthState.accountType === 'admin'
        ? '/api/admin/auth/change-password'
        : '/api/auth/change-password'

    const response = await apiRequest(path, {
      method: 'POST',
      token: currentAuthState.token,
      data: {
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      },
    })

    setAuthState(null)

    return response
  }

  const value = {
    authState,
    token: authState?.token || null,
    user: authState?.user || null,
    profile: authState?.profile || null,
    accountType: authState?.accountType || null,
    isAuthenticated: Boolean(authState?.token),
    isAdmin: authState?.accountType === 'admin',
    isUser: authState?.accountType === 'user',
    isInitializing,
    isLoadingProfile,
    loginUser,
    loginAdmin,
    registerOwner,
    createProfile,
    saveProfileChanges,
    updateProfile,
    updateUser,
    logout,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}