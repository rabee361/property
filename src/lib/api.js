const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000').replace(/\/$/, '')

function buildUrl(path) {
  if (/^https?:/i.test(path)) {
    return path
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text ? { message: text } : null
}

function buildHeaders({ token, isFormData, headers }) {
  const nextHeaders = new Headers(headers || {})

  if (!isFormData && !nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json')
  }

  if (!nextHeaders.has('Accept')) {
    nextHeaders.set('Accept', 'application/json')
  }

  if (token) {
    nextHeaders.set('Authorization', `Bearer ${token}`)
  }

  return nextHeaders
}

function createApiError(response, payload) {
  const validationErrors = payload?.errors
  const validationMessage = validationErrors
    ? Object.values(validationErrors).flat().filter(Boolean)[0]
    : null
  const message =
    validationMessage ||
    payload?.message ||
    payload?.error ||
    'Request failed'

  const error = new Error(message)
  error.status = response.status
  error.payload = payload
  return error
}

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    data,
    token,
    headers,
    signal,
  } = options

  const requestBody = data ?? body
  const isFormData = requestBody instanceof FormData
  const response = await fetch(buildUrl(path), {
    method,
    headers: buildHeaders({ token, isFormData, headers }),
    body: requestBody
      ? isFormData
        ? requestBody
        : JSON.stringify(requestBody)
      : undefined,
    signal,
  })

  const payload = await parseResponse(response)

  if (!response.ok) {
    throw createApiError(response, payload)
  }

  return payload
}

export function getApiBaseUrl() {
  return API_BASE_URL
}

export function getStorageUrl(path) {
  if (!path) {
    return null
  }

  const normalizedPath = String(path)
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+((?:https?:\/\/).*)$/i, '$1')
    .replace(/^http:\/(?!\/)/i, 'http://')
    .replace(/^https:\/(?!\/)/i, 'https://')

  const embeddedStorageMatch = normalizedPath.match(/storage\/.+$/i)

  if (/^https?:\/\/[^/]+\/https?:\/\//i.test(normalizedPath) && embeddedStorageMatch) {
    return buildUrl(embeddedStorageMatch[0])
  }

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath
  }

  const relativePath = normalizedPath.replace(/^\/+/, '')
  const storagePath = relativePath.startsWith('storage/') ? relativePath : `storage/${relativePath}`

  return buildUrl(storagePath)
}