const organizations = ["Mayora", "Citilink", "Natura World", "Sekolah & Kampus"];

export function PartnerMarquee() {
  return (
    <section className="marquee-section" id="mitra" aria-labelledby="marquee-title">
      <div className="marquee-heading">
        <p className="eyebrow"><span className="eyebrow-mark" /> B2B · SEKOLAH · KOMUNITAS</p>
        <h2 id="marquee-title">Banyak cerita, <em>dirancang bersama.</em></h2>
      </div>
      <ul className="visually-hidden">
        {organizations.map((organization) => <li key={organization}>{organization}</li>)}
      </ul>
      <div className="marquee-viewport" aria-hidden="true">
        <div className="marquee-track">
          {[...organizations, ...organizations].map((organization, index) => (
            <span className="organization-wordmark" key={`${organization}-${index}`}>
              {organization}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
