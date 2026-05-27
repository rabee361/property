import { createContext, startTransition, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../lib/api'
import { normalizeProperty, OWNER_PROPERTY_STATUS } from '../lib/property'
import { useAuth } from './AuthContext'

const OwnerPropertiesContext = createContext(null)

function appendIfPresent(formData, key, value) {
  if (value === null || value === undefined || value === '') {
    return
  }

  formData.append(key, value)
}

function buildPropertyFormData(propertyData, { isCreateMode }) {
  const formData = new FormData()

  appendIfPresent(formData, 'title', propertyData.title)
  appendIfPresent(formData, 'description', propertyData.description)
  appendIfPresent(formData, 'price', propertyData.priceValue)
  appendIfPresent(formData, 'purpose', propertyData.purpose)
  appendIfPresent(formData, 'property_type', propertyData.propertyType)
  appendIfPresent(formData, 'address', propertyData.address)
  appendIfPresent(formData, 'number_of_rooms', propertyData.numberOfRooms)
  appendIfPresent(formData, 'bathrooms', propertyData.bathrooms)
  appendIfPresent(formData, 'area_m2', propertyData.areaM2)
  appendIfPresent(formData, 'features', propertyData.features)

  if (isCreateMode) {
    formData.append('status', OWNER_PROPERTY_STATUS)
  }

  if (propertyData.deedPhotoFile instanceof File) {
    formData.append('deed_photo', propertyData.deedPhotoFile)
  }

  propertyData.additionalImageFiles.forEach((file) => {
    formData.append('image_path[]', file)
  })

  return formData
}

export function OwnerPropertiesProvider({ children }) {
  const { isUser, token } = useAuth()
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const loadProperties = async () => {
    if (!isUser || !token) {
      setProperties([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await apiRequest('/api/property/mine', {
        token,
      })

      startTransition(() => {
        setProperties((response?.properties || []).map(normalizeProperty))
      })
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load owner properties.')
      setProperties([])
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isUser || !token) {
      setProperties([])
      setErrorMessage('')
      setIsLoading(false)
      return
    }

    loadProperties().catch(() => {})
  }, [isUser, token])

  const createProperty = async (propertyData) => {
    const response = await apiRequest('/api/property/add', {
      method: 'POST',
      token,
      data: buildPropertyFormData(propertyData, { isCreateMode: true }),
    })

    const nextProperty = normalizeProperty(response?.property)

    startTransition(() => {
      setProperties((currentProperties) => [nextProperty, ...currentProperties])
    })

    return nextProperty
  }

  const updateProperty = async (propertyId, propertyData) => {
    const response = await apiRequest(`/api/property/update/${propertyId}`, {
      method: 'POST',
      token,
      data: buildPropertyFormData(propertyData, { isCreateMode: false }),
    })

    const nextProperty = normalizeProperty(response?.property)

    startTransition(() => {
      setProperties((currentProperties) =>
        currentProperties.map((property) =>
          property.id === nextProperty.id ? nextProperty : property,
        ),
      )
    })

    return nextProperty
  }

  const deleteProperty = async (propertyId) => {
    await apiRequest(`/api/property/delete/${propertyId}`, {
      method: 'DELETE',
      token,
    })

    startTransition(() => {
      setProperties((currentProperties) =>
        currentProperties.filter((property) => property.id !== propertyId),
      )
    })
  }

  const getPropertyById = (propertyId) =>
    properties.find((property) => String(property.id) === String(propertyId)) || null

  const value = {
    properties,
    isLoading,
    errorMessage,
    loadProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertyById,
  }

  return <OwnerPropertiesContext.Provider value={value}>{children}</OwnerPropertiesContext.Provider>
}

export function useOwnerProperties() {
  const context = useContext(OwnerPropertiesContext)

  if (!context) {
    throw new Error('useOwnerProperties must be used within an OwnerPropertiesProvider')
  }

  return context
}