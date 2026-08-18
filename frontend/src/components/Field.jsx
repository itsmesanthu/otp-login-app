export default function Field({ label, hint, error, children, htmlFor }) {
  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  )
}
