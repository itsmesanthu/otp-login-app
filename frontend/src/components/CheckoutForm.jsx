import { useEffect, useRef, useState } from 'react'

import { isValidEmail, useDebouncedRecognition } from '../hooks/useDebouncedRecognition'
import { api } from '../services/api'
import { countryDialingCodes, getCountryDialingCode, toE164 } from '../utils/countryDialingCodes'
import Field from './Field'
import OtpModal from './OtpModal'

const blankForm = { email: '', country_code: 'IN', phone: '', shipping_address: '' }

function formErrors(form) {
  const errors = {}
  if (!form.email.trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(form.email)) errors.email = 'Please enter a valid email address.'
  if (!form.phone.trim()) errors.phone = 'Phone number is required.'
  else if (!/^\d{6,14}$/.test(form.phone.replace(/\D/g, ''))) errors.phone = 'Enter a valid phone number without the country code.'
  else if (!/^\+[1-9]\d{6,14}$/.test(toE164(form.country_code, form.phone))) errors.phone = 'This country code and phone number are not valid together.'
  if (!form.shipping_address.trim()) errors.shipping_address = 'Shipping address is required.'
  else if (form.shipping_address.trim().length < 10) errors.shipping_address = 'Please enter a complete shipping address.'
  return errors
}

export default function CheckoutForm({ initialEmail = '' }) {
  const [form, setForm] = useState({ ...blankForm, email: initialEmail })
  const [errors, setErrors] = useState({})
  const [session, setSession] = useState(null)
  const [guestEmail, setGuestEmail] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitState, setSubmitState] = useState({ loading: false, error: '', success: '' })
  const recognition = useDebouncedRecognition(form.email)
  const openedForEmail = useRef('')

  const normalizedEmail = form.email.trim().toLowerCase()
  const selectedCountry = getCountryDialingCode(form.country_code)

  useEffect(() => {
    if (session && normalizedEmail !== session.user.email) {
      setSession(null)
    }
    if (guestEmail && guestEmail !== normalizedEmail) setGuestEmail('')
    if (openedForEmail.current && openedForEmail.current !== normalizedEmail) {
      openedForEmail.current = ''
    }
  }, [normalizedEmail, session, guestEmail])

  useEffect(() => {
    const isKnownCustomer = recognition.status === 'done' && recognition.data?.registered
    const canAskToLogin = isKnownCustomer && openedForEmail.current !== normalizedEmail && guestEmail !== normalizedEmail && session?.user.email !== normalizedEmail
    if (canAskToLogin) {
      openedForEmail.current = normalizedEmail
      setModalOpen(true)
    }
  }, [recognition, normalizedEmail, guestEmail, session])

  function update(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setSubmitState((current) => ({ ...current, error: '', success: '' }))
  }

  function continueAsGuest() {
    setGuestEmail(normalizedEmail)
    setModalOpen(false)
  }

  function verified(user, token) {
    setSession({ user, token })
    setGuestEmail('')
    setModalOpen(false)
  }

  async function submit(event) {
    event.preventDefault()
    const nextErrors = formErrors(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSubmitState({ loading: true, error: '', success: '' })
    try {
      const result = await api.checkout({
        email: normalizedEmail,
        phone: toE164(form.country_code, form.phone),
        shipping_address: form.shipping_address.trim(),
      }, session?.token)
      setSubmitState({ loading: false, error: '', success: `Saved checkout #${result.order.id}. ${result.order.authenticated ? 'It is linked to your account.' : 'You checked out as a guest.'}` })
      setForm({ ...blankForm, email: normalizedEmail, country_code: form.country_code })
    } catch (error) {
      setSubmitState({ loading: false, error: error.message, success: '' })
    }
  }

  const recognitionMessage = {
    waiting: 'Ready to check your account…',
    checking: 'Checking account…',
    done: recognition.data?.registered ? 'Existing account detected.' : 'New email — guest checkout is available.',
    error: recognition.error,
  }[recognition.status]

  return (
    <>
      {session && (
        <section className="member-banner" aria-live="polite">
          <span className="member-badge" aria-hidden="true">✓</span>
          <div><strong>Welcome, {session.user.first_name} {session.user.last_name}</strong><span>Your checkout will be saved to this account.</span></div>
          <button type="button" className="sign-out" onClick={() => setSession(null)}>Use guest checkout</button>
        </section>
      )}
      <form className="form-stack" onSubmit={submit} noValidate>
        <Field label="Email address" htmlFor="checkout_email" error={errors.email}>
          <input id="checkout_email" name="email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={update} />
          {recognitionMessage && <p className={`recognition recognition--${recognition.status}`} aria-live="polite"><span aria-hidden="true" />{recognitionMessage}</p>}
        </Field>
        <Field label="Phone number" htmlFor="phone" error={errors.phone} hint={`Choose a country code, then enter the local number. We’ll save it as ${selectedCountry.dialCode}…`}>
          <div className="phone-control">
            <label className="sr-only" htmlFor="country_code">Country and dialing code</label>
            <select id="country_code" name="country_code" value={form.country_code} onChange={update} autoComplete="tel-country-code">
              {countryDialingCodes.map((country) => <option key={country.code} value={country.code}>{country.name} ({country.dialCode})</option>)}
            </select>
            <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder={selectedCountry.placeholder} value={form.phone} onChange={update} />
          </div>
        </Field>
        <Field label="Shipping address" htmlFor="shipping_address" error={errors.shipping_address}>
          <textarea id="shipping_address" name="shipping_address" rows="4" autoComplete="street-address" placeholder="House number, street, city, state, postal code" value={form.shipping_address} onChange={update} />
        </Field>
        {submitState.error && <div className="form-alert" role="alert">{submitState.error}</div>}
        {submitState.success && <div className="success-alert" role="status">{submitState.success}</div>}
        <button className="button" type="submit" disabled={submitState.loading}>{submitState.loading ? 'Saving checkout…' : 'Save checkout'}</button>
        <p className="form-footnote">No payment is collected. This demo only records your checkout details.</p>
      </form>
      {modalOpen && (
        <OtpModal
          email={normalizedEmail}
          name={recognition.data?.first_name}
          onVerified={verified}
          onGuest={continueAsGuest}
        />
      )}
    </>
  )
}
