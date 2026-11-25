import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { FlipDigit } from '../components/FlipDigit'

import './HomePage.css'



const LAUNCH = new Date('2026-12-01T00:00:00-04:00')

const TOPIC_ICONS = {
  fashion: `${import.meta.env.BASE_URL}holiday-media/icons/fashion-gold.png`,
  realestate: `${import.meta.env.BASE_URL}holiday-media/icons/realestate-gold.png`,
  culinary: `${import.meta.env.BASE_URL}holiday-media/icons/culinary-gold.png`,
  sponsors: `${import.meta.env.BASE_URL}holiday-media/icons/sponsors-gold.png`,
  magazine: `${import.meta.env.BASE_URL}holiday-media/icons/magazine-gold.png?v=3`,
} as const

function pad(n: number) {

  return n < 10 ? `0${n}` : String(n)

}

function CountUnit({ value, label }: { value: number; label: string }) {

  const digits = pad(value)

  return (

    <div className="count__unit">

      <div className="count__digits">

        <FlipDigit digit={digits[0]} />

        <FlipDigit digit={digits[1]} />

      </div>

      <span className="count__label">{label}</span>

    </div>

  )

}



export function HomePage() {

  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {

    const t = setInterval(() => setNow(Date.now()), 1000)

    return () => clearInterval(t)

  }, [])



  const diff = Math.max(0, LAUNCH.getTime() - now)

  const s = Math.floor(diff / 1000)

  const days = Math.floor(s / 86400)

  const hours = Math.floor((s % 86400) / 3600)

  const mins = Math.floor((s % 3600) / 60)

  const secs = s % 60



  return (

    <section className="page page--home">

      <div className="page--home__content">

      <p className="page__kicker">Coming 1 December 2026</p>

      <h2 className="page__title">Holiday season, Blue Wave style</h2>

      <p className="page__lead">

        Same clean app feeling you know — now focused on Fashion & Lifestyle,

        Real Estate, and Culinary for the holidays in Curaçao.

      </p>



      <div className="count" aria-live="polite" role="timer">

        <CountUnit value={days} label="Days" />

        <CountUnit value={hours} label="Hours" />

        <CountUnit value={mins} label="Min" />

        <CountUnit value={secs} label="Sec" />

      </div>



      <section className="get-app card" aria-label="Get the app">

        <p className="page__kicker">Get the app</p>

        <h3>Blue Holiday Wave on your phone</h3>

        <p className="get-app__row">

          <strong>Android</strong>

          <a href="https://www.thebluewavefans.com/holidayseason/get-the-app.html">

            Download the Android app

          </a>

        </p>

        <p className="get-app__row">

          <strong>iPhone</strong>

          Open the Share menu and tap Add to Home Screen.

        </p>

      </section>



      <div className="topics">

        <Link className="topic topic--with-icon" to="/fashion">

          <div className="topic__copy">

            <strong>Fashion & Lifestyle</strong>

            <span>Partner stores, lookbooks, island style</span>

          </div>

          <span className="topic__icon-ring" aria-hidden="true">

            <img
              className="topic__icon"
              src={TOPIC_ICONS.fashion}
              alt=""
              width={77}
              height={77}
              decoding="async"
            />

          </span>

        </Link>

        <Link className="topic topic--with-icon" to="/homes">

          <div className="topic__copy">

            <strong>Real Estate</strong>

            <span>Partner agencies and featured homes</span>

          </div>

          <span className="topic__icon-ring" aria-hidden="true">

            <img
              className="topic__icon"
              src={TOPIC_ICONS.realestate}
              alt=""
              width={77}
              height={77}
              decoding="async"
            />

          </span>

        </Link>

        <Link className="topic topic--with-icon" to="/taste">

          <div className="topic__copy">

            <strong>Culinary</strong>

            <span>Partner restaurants and holiday menus</span>

          </div>

          <span className="topic__icon-ring" aria-hidden="true">

            <img
              className="topic__icon"
              src={TOPIC_ICONS.culinary}
              alt=""
              width={77}
              height={77}
              decoding="async"
            />

          </span>

        </Link>

        <Link className="topic topic--with-icon" to="/magazine">

          <div className="topic__copy">

            <strong>Magazine</strong>

            <span>Editorial, ads, and print partners</span>

          </div>

          <span className="topic__icon-ring" aria-hidden="true">

            <img
              className="topic__icon"
              src={TOPIC_ICONS.magazine}
              alt=""
              width={77}
              height={77}
              decoding="async"
            />

          </span>

        </Link>

        <Link className="topic topic--with-icon" to="/more">

          <div className="topic__copy">

            <strong>Sponsors</strong>

            <span>Hospitality, finance, and events</span>

          </div>

          <span className="topic__icon-ring" aria-hidden="true">

            <img
              className="topic__icon"
              src={TOPIC_ICONS.sponsors}
              alt=""
              width={77}
              height={77}
              decoding="async"
            />

          </span>

        </Link>

      </div>

      </div>

    </section>

  )

}

