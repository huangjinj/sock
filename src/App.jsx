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

function ProductDetails({ product, locale, labels, specItems, onBack }) {
  // 确保specItems存在，如果不存在则使用默认值
  const t = { 
    product: { 
      specItems: specItems || {
        thickness: ['thin', 'medium', 'thick'],
        elasticity: ['slight', 'elastic', 'superelastic'],
        flexibility: ['regular', 'soft', 'very soft']
      }
    }
  }; // 创建一个包含specItems的t对象
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
                  // 获取所有可能的选项
                  const allOptions = t.product.specItems[key] || [];
                  
                  // 获取当前选中的选项的翻译
                  const getSpecLabel = (specValue) => {
                    // 根据当前语言选择翻译映射
                    const isChinese = locale === 'zh-CN';
                    
                    if (key === 'thickness') {
                      const thicknessMap = isChinese ? {
                        'thin': '偏薄',
                        'medium': '居中',
                        'thick': '偏厚'
                      } : {
                        '偏薄': 'thin',
                        '居中': 'medium',
                        '偏厚': 'thick'
                      };
                      return thicknessMap[specValue] || specValue;
                    } else if (key === 'elasticity') {
                      const elasticityMap = isChinese ? {
                        'slight': '微弹',
                        'elastic': '弹力',
                        'superelastic': '超弹'
                      } : {
                        '微弹': 'slight',
                        '弹力': 'elastic',
                        '超弹': 'superelastic'
                      };
                      return elasticityMap[specValue] || specValue;
                    } else if (key === 'flexibility') {
                      const flexibilityMap = isChinese ? {
                        'regular': '常规',
                        'soft': '柔软',
                        'very soft': '很柔软'
                      } : {
                        '常规': 'regular',
                        '柔软': 'soft',
                        '很柔软': 'very soft'
                      };
                      return flexibilityMap[specValue] || specValue;
                    }
                    return specValue;
                  };
                  
                  // 获取当前选中项的翻译
                  const currentLabel = getSpecLabel(value);
                  
                  return (
                    <li key={key}>
                      <strong>{key}:</strong>
                      <div className="spec-options">
                        {allOptions.map((option, index) => {
                          const optionLabel = getSpecLabel(option);
                          const isSelected = option === value;
                          return (
                            <span 
                              key={index} 
                              className={`spec-option ${isSelected ? 'selected' : ''}`}
                            >
                              {optionLabel}
                            </span>
                          );
                        })}
                      </div>
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
                specItems={t.product.specItems} 
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
