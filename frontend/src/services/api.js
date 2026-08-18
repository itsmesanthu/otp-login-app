const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '')

async function request(path, { method = 'POST', body, token, signal } = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Unable to connect to the server. Please try again.')
  }

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const firstValidationError = Object.values(payload).find((value) => Array.isArray(value))
    throw new Error(firstValidationError?.[0] || payload.detail || payload.message || 'Something went wrong. Please try again.')
  }
  return payload
}

export const api = {
  register: (body) => request('/users/register/', { body }),
  recognize: (email, signal) => request('/users/recognize/', { body: { email }, signal }),
  verifyOtp: (body) => request('/users/verify-otp/', { body }),
  checkout: (body, token) => request('/checkout/', { body, token }),
}
