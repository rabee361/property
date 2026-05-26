import { createContext, startTransition, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import avatarImg from '../assets/avatar.png'
import { useAuth } from './AuthContext'
import { apiRequest } from '../lib/api'
import { normalizeProperty } from '../lib/property'

const BuyerContext = createContext()

const OFFERS_STORAGE_KEY = 'buyerOffers'
const PROFILE_STORAGE_KEY = 'buyerProfile'
const INITIAL_PROPERTY_FILTERS = {
  search: '',
  city: '',
  purpose: '',
  property_type: '',
  min_price: '',
  max_price: '',
  page: 1,
  per_page: 12,
}

function buildPropertiesPath(filters = INITIAL_PROPERTY_FILTERS) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    params.set(key, String(value))
  })

  const query = params.toString()
  return query ? `/api/app/properties?${query}` : '/api/app/properties'
}

const initialProfile = {
  username: 'Guest User',
  email: '',
  avatar: avatarImg,
}

function readStorageValue(storageKey, fallbackValue) {
  const storedValue = localStorage.getItem(storageKey)

  if (!storedValue) {
    return fallbackValue
  }

  try {
    return JSON.parse(storedValue)
  } catch {
    return fallbackValue
  }
}

export function BuyerProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isUser, token, user } = useAuth()
  const [offers, setOffers] = useState(() => readStorageValue(OFFERS_STORAGE_KEY, []))
  const [profile, setProfile] = useState(() => ({
    ...initialProfile,
    ...readStorageValue(PROFILE_STORAGE_KEY, {}),
  }))
  const [properties, setProperties] = useState([])
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [favoriteIds, setFavoriteIds] = useState([])
  const [favoriteEntries, setFavoriteEntries] = useState([])
  const [isLoadingProperties, setIsLoadingProperties] = useState(true)
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true)
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false)
  const [propertyPagination, setPropertyPagination] = useState(null)
  const [propertyFilters, setPropertyFilters] = useState(INITIAL_PROPERTY_FILTERS)
  const [propertyLoadError, setPropertyLoadError] = useState('')
  const [featuredLoadError, setFeaturedLoadError] = useState('')

  useEffect(() => {
    localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(offers))
  }, [offers])

  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const loadProperties = async (nextFilters = {}, options = {}) => {
    const mergedFilters = {
      ...INITIAL_PROPERTY_FILTERS,
      ...propertyFilters,
      ...nextFilters,
    }

    setIsLoadingProperties(true)
    setPropertyLoadError('')

    try {
      const response = await apiRequest(buildPropertiesPath(mergedFilters), {
        signal: options.signal,
      })

      startTransition(() => {
        setProperties((response?.properties || []).map(normalizeProperty))
        setPropertyPagination(response?.pagination || null)
        setPropertyFilters(mergedFilters)
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        setPropertyLoadError(error.message || 'Failed to load public properties.')
        setProperties([])
        setPropertyPagination(null)
        setPropertyFilters(mergedFilters)
      }
    } finally {
      setIsLoadingProperties(false)
    }
  }

  const loadFeaturedProperties = async (options = {}) => {
    setIsLoadingFeatured(true)
    setFeaturedLoadError('')

    try {
      const response = await apiRequest('/api/app/properties/featured', {
        signal: options.signal,
      })

      startTransition(() => {
        setFeaturedProperties((response?.properties || []).map(normalizeProperty))
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        setFeaturedLoadError(error.message || 'Failed to load featured properties.')
        setFeaturedProperties([])
      }
    } finally {
      setIsLoadingFeatured(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    loadProperties(INITIAL_PROPERTY_FILTERS, { signal: controller.signal })
    loadFeaturedProperties({ signal: controller.signal })

    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      username: user?.name || currentProfile.username || initialProfile.username,
      email: user?.email || currentProfile.email || initialProfile.email,
    }))
  }, [user])

  useEffect(() => {
    if (!isUser || !token) {
      setFavoriteIds([])
      setFavoriteEntries([])
      return
    }

    let isMounted = true
    const controller = new AbortController()

    const loadFavorites = async () => {
      setIsLoadingFavorites(true)

      try {
        const response = await apiRequest('/api/favorite/properties', {
          token,
          signal: controller.signal,
        })

        if (!isMounted) {
          return
        }

        const nextFavorites = (response?.data || []).map(normalizeProperty)

        startTransition(() => {
          setFavoriteEntries(nextFavorites)
          setFavoriteIds(nextFavorites.map((property) => property.id))
        })
      } catch (error) {
        if (error.name !== 'AbortError' && isMounted) {
          setFavoriteEntries([])
          setFavoriteIds([])
        }
      } finally {
        if (isMounted) {
          setIsLoadingFavorites(false)
        }
      }
    }

    loadFavorites()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [isUser, token])

  const favoriteProperties = useMemo(
    () =>
      favoriteEntries.map(
        (favoriteProperty) =>
          properties.find((property) => property.id === favoriteProperty.id) || favoriteProperty,
      ),
    [favoriteEntries, properties],
  )

  const offersWithProperties = useMemo(
    () =>
      offers
        .map((offer) => ({
          ...offer,
          property: properties.find((property) => property.id === offer.propertyId),
        }))
        .filter((offer) => offer.property),
    [offers, properties],
  )

  const isFavorite = (propertyId) => favoriteIds.includes(propertyId)

  const toggleFavorite = async (propertyId, propertySnapshot = null) => {
    if (!isUser || !token) {
      navigate('/login', {
        state: {
          from: location.pathname,
        },
      })
      return false
    }

    const response = await apiRequest(`/api/favorite/properties/add/${propertyId}`, {
      method: 'POST',
      token,
    })

    const property =
      propertySnapshot ||
      properties.find((entry) => entry.id === propertyId) ||
      featuredProperties.find((entry) => entry.id === propertyId)

    startTransition(() => {
      setFavoriteIds((currentFavoriteIds) =>
        response?.is_favorite
          ? [...new Set([...currentFavoriteIds, propertyId])]
          : currentFavoriteIds.filter((currentId) => currentId !== propertyId),
      )

      setFavoriteEntries((currentEntries) => {
        if (response?.is_favorite) {
          if (!property || currentEntries.some((entry) => entry.id === propertyId)) {
            return currentEntries
          }

          return [property, ...currentEntries]
        }

        return currentEntries.filter((entry) => entry.id !== propertyId)
      })
    })

    return response?.is_favorite ?? false
  }

  const submitOffer = ({ propertyId, amount, note = '' }) => {
    const normalizedAmount = amount.trim()

    startTransition(() => {
      setOffers((currentOffers) => {
        const nextOffer = {
          propertyId,
          amount: normalizedAmount,
          note: note.trim(),
          submittedAt: new Date().toISOString(),
          status: 'Pending',
        }

        const existingOfferIndex = currentOffers.findIndex((offer) => offer.propertyId === propertyId)

        if (existingOfferIndex === -1) {
          return [nextOffer, ...currentOffers]
        }

        return currentOffers.map((offer, index) => (index === existingOfferIndex ? nextOffer : offer))
      })
    })
  }

  const updateProfile = (updates) => {
    setProfile((currentProfile) => ({ ...currentProfile, ...updates }))
  }

  const value = {
    profile,
    updateProfile,
    properties,
    featuredProperties,
    favoriteIds,
    favoriteProperties,
    isFavorite,
    toggleFavorite,
    searchProperties: loadProperties,
    propertyPagination,
    propertyFilters,
    propertyLoadError,
    isLoadingFeatured,
    featuredLoadError,
    offers: offersWithProperties,
    submitOffer,
    isLoadingProperties,
    isLoadingFavorites,
  }

  return <BuyerContext.Provider value={value}>{children}</BuyerContext.Provider>
}

export function useBuyer() {
  const context = useContext(BuyerContext)

  if (!context) {
    throw new Error('useBuyer must be used within a BuyerProvider')
  }

  return context
}
