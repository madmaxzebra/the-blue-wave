export function PrivacyPage() {
  return (
    <section className="page">
      <p className="page__kicker">The Blue Holiday Wave</p>
      <h2 className="page__title">Privacy</h2>
      <p className="page__lead">
        This app shows public holiday content: fashion, homes, culinary,
        magazine, and sponsors. You do not need an account to use it.
      </p>
      <div className="grid">
        <article className="card">
          <h3>What we collect</h3>
          <p>
            The app itself does not ask for your name, email, photos, or
            location. We do not sell personal information.
          </p>
          <p>
            If you leave a review, we keep the stars, text, and name you type
            (you can leave the name empty) and show them publicly on that
            page. If you ask to claim a page as its owner, we keep the name,
            email, phone, and message you type, only to contact you about
            that page. To limit spam we also keep a one-way scrambled code of
            your connection for up to a day; it cannot be turned back into
            your address. To remove a review or request, contact us.
          </p>
          <p>
            Owners who activate a page choose a username and a password. We
            keep the username and a scrambled version of the password (we
            cannot read it), the text and photos the owner adds to their page,
            and the date of each change. Those texts and photos are shown
            publicly on that page. To remove an owner account, contact us.
          </p>
        </article>
        <article className="card">
          <h3>Third-party content</h3>
          <p>
            Store detail pages may load a Google Maps iframe to show a
            location. When that map loads, Google may receive your IP address
            and browser information according to{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google's privacy policy
            </a>
            . Some photos and logos are the businesses' own, used to
            describe them in this independent guide.
          </p>
        </article>
        <article className="card">
          <h3>The website host</h3>
          <p>
            When the app or site loads, the web host may keep normal technical
            logs (such as IP address and browser type) to keep the service
            running. Those logs are not used for advertising.
          </p>
        </article>
        <article className="card">
          <h3>Contact</h3>
          <p>
            Questions about this policy: use the contact on
            thebluewavefans.com.
          </p>
        </article>
      </div>
    </section>
  )
}
