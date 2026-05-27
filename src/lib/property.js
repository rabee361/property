import fallbackPropertyImage from '../assets/hero.jpg'
import { getStorageUrl } from './api'

function resolvePropertyImage(path) {
  return getStorageUrl(path) || fallbackPropertyImage
}

function collectPropertyImages(property) {
  const imageSet = new Set()

  if (property?.deed_photo) {
    imageSet.add(resolvePropertyImage(property.deed_photo))
  }

  for (const image of property?.images || []) {
    if (image?.image_path) {
      imageSet.add(resolvePropertyImage(image.image_path))
    }
  }

  if (imageSet.size === 0) {
    imageSet.add(fallbackPropertyImage)
  }

  return [...imageSet]
}

export function formatPropertyPrice(price) {
  const numericPrice = Number(price)

  if (!Number.isFinite(numericPrice)) {
    return price || ''
  }

  return `${new Intl.NumberFormat('en-US').format(numericPrice)} SYP`
}

export function normalizeProperty(property) {
  const galleryImages = collectPropertyImages(property)
  const primaryImage = galleryImages[0] || fallbackPropertyImage
  const purpose = property?.purpose || ''
  const propertyType = property?.property_type || property?.type || 'Property'
  const specs = [propertyType, purpose].filter(Boolean).join(' • ')
  const images = (property?.images || []).map((image) => ({
    ...image,
    image_path: resolvePropertyImage(image?.image_path),
  }))

  return {
    id: property.id,
    image: primaryImage,
    galleryImages,
    images,
    deedPhoto: resolvePropertyImage(property?.deed_photo),
    title: property.title || 'Untitled Property',
    specs,
    description: property.description || '',
    price: formatPropertyPrice(property.price),
    priceValue: Number(property.price) || 0,
    area: Number(property.area_m2) || 0,
    beds: Number(property.number_of_rooms) || 0,
    baths: Number(property.bathrooms ?? property.baths) || 0,
    type: purpose || propertyType,
    purpose,
    propertyType,
    location: property.address || '',
    status: property.status || '',
    features: property.features || '',
    raw: property,
  }
}

export const PROPERTY_TYPE_OPTIONS = [
  'apartment',
  'villa',
  'land',
  'office',
  'shop',
  'architecture',
]

export const PROPERTY_PURPOSE_OPTIONS = ['sale', 'rent']

export const OWNER_PROPERTY_STATUS = 'pending'