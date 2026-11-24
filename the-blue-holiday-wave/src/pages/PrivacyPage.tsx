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
