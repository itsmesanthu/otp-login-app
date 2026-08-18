import { useState } from 'react'


import CheckoutPage from './pages/CheckoutPage'
import RegistrationPage from './pages/RegistrationPage'

export default function App() {
  const [page, setPage] = useState('register')
  const [registeredEmail, setRegisteredEmail] = useState('')

  function handleRegistered(email) {
    setRegisteredEmail(email)
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <nav aria-label="Main navigation">
          <button className={page === 'register' ? 'nav-link nav-link--active' : 'nav-link'} type="button" onClick={() => setPage('register')}>Register</button>
          <button className={page === 'checkout' ? 'nav-link nav-link--active' : 'nav-link'} type="button" onClick={() => setPage('checkout')}>Checkout</button>
        </nav>
      </header>
      {page === 'register'
        ? <RegistrationPage onRegistered={handleRegistered} />
        : <CheckoutPage initialEmail={registeredEmail} />}
      <footer><b><span>OTP login assignment demo</span></b></footer>
    </div>
  )
}
