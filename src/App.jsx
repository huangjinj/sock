import { useMemo, useState } from 'react'
import { loadTranslations, supportedLocales, selectLocale } from './i18n'

function formatPrice(value, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: locale === 'zh-CN' ? 'CNY' : 'USD',
    maximumFractionDigits: 0
  }).format(value)
}

function ProductCard({ product, locale, buyButtonLabel, labels }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img
          src={product.imageUrl}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
      </div>
      <div className="product-details">
        <h3>{product.name}</h3>
        <p className="product-price">{formatPrice(product.price, locale)}</p>
        <dl>
          {product.manufacturer && (
            <>
              <dt>{labels.manufacturer}</dt>
              <dd>{product.manufacturer}</dd>
            </>
          )}
          {product.material && (
            <>
              <dt>{labels.material}</dt>
              <dd>{product.material}</dd>
            </>
          )}
          {product.style && (
            <>
              <dt>{labels.style}</dt>
              <dd>{product.style}</dd>
            </>
          )}
          {product.functionality && (
            <>
              <dt>{labels.functionality}</dt>
              <dd>{product.functionality}</dd>
            </>
          )}
        </dl>
        <div className="product-meta">
          {product.colors?.length > 0 && (
            <p>
              <strong>{labels.colors}:</strong> {product.colors.join(', ')}
            </p>
          )}
          {product.sizes?.length > 0 && (
            <p>
              <strong>{labels.sizes}:</strong> {product.sizes.join(', ')}
            </p>
          )}
        </div>
        <div className="product-specs">
          <h4>{labels.specs}</h4>
          <ul>
            {Object.entries(product.specs).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
        <button type="button">{buyButtonLabel}</button>
      </div>
    </article>
  )
}

export default function App() {
  const [locale, setLocale] = useState('en-US')
  const t = useMemo(() => loadTranslations(locale), [locale])

  return (
    <div className="page-shell">
      <header className="site-header">
        <div>
          <p className="brand">{t.common.header.siteTitle}</p>
        </div>
        <div className="language-switcher">
          <label htmlFor="locale-select">Language</label>
          <select
            id="locale-select"
            value={locale}
            onChange={(event) => setLocale(selectLocale(event.target.value))}
          >
            {supportedLocales.map((localeKey) => (
              <option key={localeKey} value={localeKey}>
                {localeKey}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div>
            <h1>{t.common.companyIntro.title}</h1>
            <p>{t.common.companyIntro.description}</p>
          </div>
        </section>

        <section className="products-section">
          <div className="section-heading">
            <h2>{t.common.product.productTitle}</h2>
          </div>
          <div className="products-grid">
            {t.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                buyButtonLabel={t.product.buyButton}
                labels={t.product.labels}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-contact">
          <div>
            <label>{t.common.footer.contact.address}</label>
          </div>
          <div>
            <label>{t.common.footer.contact.emailLabel}</label>
            <a href={`mailto:${t.common.footer.contact.email}`}>{t.common.footer.contact.email}</a>
          </div>
          <div>
            <label>{t.common.footer.contact.phoneLabel}</label>
            <span>{t.common.footer.contact.phone}</span>
          </div>
        </div>
        <p>{t.common.footer.copyright}</p>
      </footer>
    </div>
  )
}
