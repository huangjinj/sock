import { useMemo, useState } from 'react'
import { loadTranslations, supportedLocales, selectLocale } from './i18n'

function formatPrice(value, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: locale === 'zh-CN' ? 'CNY' : 'USD',
    maximumFractionDigits: 0
  }).format(value)
}

function ProductCard({ product, locale, labels, onProductClick }) {
  return (
    <article className="product-card" onClick={() => onProductClick(product)} style={{ cursor: 'pointer' }}>
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
      </div>
    </article>
  )
}

function ProductDetails({ product, locale, labels, onBack }) {
  return (
    <div className="product-details-page">
      <button className="back-button" onClick={onBack}>← Back to Shop</button>
      <div className="product-details-container">
        <div className="product-image-large">
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="product-price-large">{formatPrice(product.price, locale)}</p>
          
          <dl>
            {product.manufacturer && (
              <>
                <dt>{labels.manufacturer}</dt>
                <dd>{product.manufacturer}</dd>
              </>
            )}
            {product.quantity && (
              <>
                <dt>Quantity</dt>
                <dd>{product.quantity}</dd>
              </>
            )}
            {product.material && (
              <>
                <dt>{labels.material}</dt>
                <dd>{product.material}</dd>
              </>
            )}
            {product.functionality && (
              <>
                <dt>{labels.functionality}</dt>
                <dd>{product.functionality}</dd>
              </>
            )}
          </dl>

          {product.colors && product.colors.length > 0 && (
            <div className="product-colors">
              <h3>{labels.colors}</h3>
              <div className="color-options">
                {product.colors.map((color, index) => (
                  <span key={index} className="color-badge">{color}</span>
                ))}
              </div>
            </div>
          )}

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="product-specs">
              <h3>{labels.specs}</h3>
              <ul>
                {Object.entries(product.specs).map(([key, value]) => {
                  let specLabel = value;
                  if (key === 'thickness') {
                    const thicknessMap = {
                      'thin': '偏薄',
                      'medium': '居中',
                      'thick': '偏厚',
                      '偏薄': '偏薄',
                      '居中': '居中',
                      '偏厚': '偏厚'
                    };
                    specLabel = thicknessMap[value] || value;
                  } else if (key === 'elasticity') {
                    const elasticityMap = {
                      'slight': '微弹',
                      'elastic': '弹力',
                      'super elastic': '超弹',
                      '微弹': '微弹',
                      '弹力': '弹力',
                      '超弹': '超弹'
                    };
                    specLabel = elasticityMap[value] || value;
                  } else if (key === 'flexibility') {
                    const flexibilityMap = {
                      'regular': '常规',
                      'soft': '柔软',
                      'very soft': '很柔软',
                      '常规': '常规',
                      '柔软': '柔软',
                      '很柔软': '很柔软'
                    };
                    specLabel = flexibilityMap[value] || value;
                  }
                  return (
                    <li key={key}>
                      <strong>{key}:</strong> {specLabel}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {product.fit && (
            <div className="product-fit">
              <h3>{labels.fit}</h3>
              <ul>
                {Object.entries(product.fit).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [locale, setLocale] = useState('en-US')
  const [activePage, setActivePage] = useState('SHOP')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const t = useMemo(() => loadTranslations(locale), [locale])

  const handleProductClick = (product) => {
    setSelectedProduct(product)
  }

  const handleBackToShop = () => {
    setSelectedProduct(null)
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <div>
          <p className="brand">{t.common.header.siteTitle}</p>
        </div>
        <nav className="top-menu">
          {['SHOP', 'ABOUT', 'CONTACT'].map((item) => (
            <button 
              key={item} 
              className={`menu-item ${activePage === item ? 'active' : ''}`}
              onClick={() => setActivePage(item)}
            >
              {item}
            </button>
          ))}
        </nav>
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
        {activePage === 'SHOP' && (
          <section className="products-section">
            {selectedProduct ? (
              <ProductDetails 
                product={selectedProduct} 
                locale={locale} 
                labels={t.product.labels} 
                onBack={handleBackToShop}
              />
            ) : (
              <>
                <div className="section-heading">
                  <h2>{t.common.product.productTitle}</h2>
                </div>
                <div className="products-grid">
                  {t.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={locale}
                      labels={t.product.labels}
                      onProductClick={handleProductClick}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {activePage === 'ABOUT' && (
          <section className="hero-section">
            <div>
              <h1>{t.common.companyIntro.title}</h1>
              <p>{t.common.companyIntro.description}</p>
            </div>
          </section>
        )}

        {activePage === 'CONTACT' && (
          <section className="contact-section">
            <div className="contact-info">
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
              <div>
                <img
                  src="/images/weChat_Huang.jpg" 
                  alt={t.common.footer.contact.webChatAlt} 
                  style={{ width: '30%', height: '30%' }}
                />
                <div><label style={{ marginTop: '10px' }}>{t.common.footer.contact.webChatLabel}</label></div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <p>{t.common.footer.copyright}</p>
      </footer>
    </div>
  )
}
