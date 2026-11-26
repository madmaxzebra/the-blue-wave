type DisplayProps = {
  value: number
  size?: 'sm' | 'md'
}

/** Read-only stars, supports half-filled display for averages. */
export function StarsDisplay({ value, size = 'md' }: DisplayProps) {
  return (
    <span className={`stars stars--${size}`} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - (n - 1)))
        return (
          <span key={n} className="stars__star" aria-hidden="true">
            <span className="stars__base">★</span>
            <span className="stars__fill" style={{ width: `${fill * 100}%` }}>
              ★
            </span>
          </span>
        )
      })}
    </span>
  )
}

type InputProps = {
  value: number
  onChange: (value: number) => void
  name: string
}

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']

/** Pick 1 to 5 stars. Works with touch, mouse and keyboard (arrow keys). */
export function StarsInput({ value, onChange, name }: InputProps) {
  return (
    <div className="stars-input" role="radiogroup" aria-label="Your rating from 1 to 5 stars">
      <div className="stars-input__row">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className={`stars-input__star${n <= value ? ' is-on' : ''}`}>
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
            />
            <span aria-hidden="true">★</span>
          </label>
        ))}
      </div>
      <p className="stars-input__label" aria-live="polite">
        {value ? `${value} of 5 · ${LABELS[value]}` : 'Tap a star to rate'}
      </p>
    </div>
  )
}
