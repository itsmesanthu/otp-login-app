import { useEffect, useRef, useState } from 'react'

import { api } from '../services/api'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value) {
  return emailPattern.test(value.trim())
}

export function useDebouncedRecognition(email) {
  const [state, setState] = useState({ status: 'idle', data: null, error: '' })
  const requestVersion = useRef(0)

  useEffect(() => {
    const normalizedEmail = email.trim().toLowerCase()
    const version = ++requestVersion.current
    if (!normalizedEmail) {
      setState({ status: 'idle', data: null, error: '' })
      return undefined
    }
    if (!isValidEmail(normalizedEmail)) {
      setState({ status: 'invalid', data: null, error: '' })
      return undefined
    }

    const controller = new AbortController()
    setState({ status: 'waiting', data: null, error: '' })
    const timeout = window.setTimeout(async () => {
      setState({ status: 'checking', data: null, error: '' })
      try {
        const data = await api.recognize(normalizedEmail, controller.signal)
        if (version === requestVersion.current) setState({ status: 'done', data, error: '' })
      } catch (error) {
        if (error.name !== 'AbortError' && version === requestVersion.current) {
          setState({ status: 'error', data: null, error: error.message })
        }
      }
    }, 450)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [email])

  return state
}
