import { useEffect, useRef, useState } from 'react'

import { api } from '../services/api'

export default function OtpModal({ email, name, onVerified, onGuest }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function updateCode(event) {
    setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
    setError('')
  }

  async function verify(event) {
    event.preventDefault()
    if (code.length !== 6) {
      setError('Enter the six-digit code from registration.')
      return
    }
    setLoading(true)
    try {
      const data = await api.verifyOtp({ email, code })
      onVerified(data.user, data.token)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="otp-modal" role="dialog" aria-modal="true" aria-labelledby="otp-title">
        <div className="modal-icon" aria-hidden="true">⌁</div>
        <p className="eyebrow">Welcome back{name ? `, ${name}` : ''}</p>
        <h2 id="otp-title">Your account is ready.</h2>
        <p>We found an account for <strong>{email}</strong>. Enter your six-digit login code to attach this checkout.</p>
        <form onSubmit={verify} noValidate>
          <label className="sr-only" htmlFor="otp-code">Six-digit login code</label>
          <input
            className="otp-input"
            id="otp-code"
            ref={inputRef}
            value={code}
            onChange={updateCode}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength="6"
            placeholder="••••••"
            aria-describedby={error ? 'otp-error' : undefined}
          />
          {error && <p id="otp-error" className="field-error otp-error" role="alert">{error}</p>}
          <button className="button" type="submit" disabled={loading}>{loading ? 'Verifying…' : 'Verify & continue'}</button>
        </form>
        <button className="text-button" type="button" onClick={onGuest} disabled={loading}>Continue as guest</button>
      </section>
    </div>
  )
}
