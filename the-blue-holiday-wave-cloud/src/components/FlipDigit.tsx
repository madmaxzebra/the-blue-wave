import { useEffect, useState } from 'react'

type FlipDigitProps = {
  digit: string
}

export function FlipDigit({ digit }: FlipDigitProps) {
  const [current, setCurrent] = useState(digit)
  const [previous, setPrevious] = useState(digit)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    if (digit === current) return
    setPrevious(current)
    setFlipping(true)
  }, [digit, current])

  const finishFlip = () => {
    setCurrent(digit)
    setFlipping(false)
  }

  return (
    <div className="count__digit" aria-hidden="true">
      <div className="count__digit-scene">
        <div className="count__digit-half count__digit-half--bottom">
          <span className="count__digit-num">{current}</span>
        </div>
        <div className="count__digit-half count__digit-half--top count__digit-half--static">
          <span className="count__digit-num">{flipping ? digit : current}</span>
        </div>
        {flipping ? (
          <div
            className="count__digit-half count__digit-half--top count__digit-flap"
            onAnimationEnd={finishFlip}
          >
            <span className="count__digit-num">{previous}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
