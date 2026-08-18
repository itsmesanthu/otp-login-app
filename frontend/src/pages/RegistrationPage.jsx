import RegistrationForm from '../components/RegistrationForm'

export default function RegistrationPage({ onRegistered }) {
  return (
    <main className="page-grid" id="top">
      <section className="form-card" aria-labelledby="registration-title">

        <RegistrationForm onRegistered={onRegistered} />
      </section>
    </main>
  )
}
