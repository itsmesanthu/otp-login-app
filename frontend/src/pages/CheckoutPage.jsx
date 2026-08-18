import CheckoutForm from '../components/CheckoutForm'

export default function CheckoutPage({ initialEmail }) {
  return (
    <main className="page-grid" id="top">
      <section className="form-card" aria-labelledby="checkout-title">
        <p className="section-kicker">Delivery details</p>
        <h2 id="checkout-title">Where should we send it?</h2>
        <p className="card-copy">You can fill in the form while we look for your account.</p>
        <CheckoutForm initialEmail={initialEmail} />
      </section>
    </main>
  )
}
