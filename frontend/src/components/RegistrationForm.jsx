import { useState } from 'react'
import Field from './Field'
import { isValidEmail } from '../hooks/useDebouncedRecognition'
import { api } from '../services/api'
const emptyForm = { first_name: '', last_name: '', email: '' }

function validationErrors(form) {
  const errors = {}
  if (!form.first_name.trim()) errors.first_name = 'First name is required.'
  if (!form.last_name.trim()) errors.last_name = 'Last name is required.'
  if (!form.email.trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(form.email)) errors.email = 'Please enter a valid email address.'
  return errors
}

export default function RegistrationForm({ onRegistered }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setServerError('')
  }

  async function submit(event) {
    event.preventDefault()
    const nextErrors = validationErrors(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    setServerError('')
    try {
      const data = await api.register({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim().toLowerCase(),
      })
      setResult(data)
      onRegistered(data.user.email)
    } catch (error) {
      setServerError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <section className="success-card" aria-live="polite">
        <span className="success-icon" aria-hidden="true">✓</span>
        <p className="eyebrow">Account created</p>
        <h2>Keep this code somewhere safe.</h2>
        <p className="subtle">Use it to sign in whenever you check out with <strong>{result.user.email}</strong>.</p>
        <div className="otp-display" aria-label={`Your login code is ${result.otp_code}`}>
          {result.otp_code.split('').map((digit, index) => <span key={`${digit}-${index}`}>{digit}</span>)}
        </div>
        <p className="code-note">This code is shown only once so capy it .</p>
        <button className="button button--secondary" type="button" onClick={() => { setResult(null); setForm(emptyForm) }}>
          Register another account
        </button>
      </section>
    )
  }

  return (
    <form className="form-stack" onSubmit={submit} noValidate>
      <p className="section-kicker">New here?</p>
        <h2 id="registration-title">Create your account</h2>
        <p className="card-copy">Your login code is generated securely when you register.</p>
      <div className="name-grid">
        <Field label="First name" htmlFor="first_name" error={errors.first_name}>
          <input id="first_name" name="first_name" value={form.first_name} onChange={updateField} autoComplete="given-name" />
        </Field>
        <Field label="Last name" htmlFor="last_name" error={errors.last_name}>
          <input id="last_name" name="last_name" value={form.last_name} onChange={updateField} autoComplete="family-name" />
        </Field>
      </div>
      <Field label="Email address" htmlFor="register_email" error={errors.email} hint="We’ll use this to recognize you at checkout.">
        <input id="register_email" name="email" type="email" inputMode="email" value={form.email} onChange={updateField} autoComplete="email" />
      </Field>
      {serverError && <div className="form-alert" role="alert">{serverError}</div>}
      <button className="button" type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
    </form>
  )
}
