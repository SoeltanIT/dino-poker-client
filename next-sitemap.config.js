/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://gowin.gg',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/bank-account', '/bet-history', '/my-wallet', '/transaction-history', '/my-promotion'],
  alternateRefs: [
    {
      href: 'https://gowin.gg/en',
      hreflang: 'en'
    },
    {
      href: 'https://gowin.gg/ko',
      hreflang: 'ko'
    }
  ],
  transform: async (config, path) => {
    return {
      loc: path,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: path === '/' ? 1.0 : 0.7
    }
  },
  additionalPaths: async () => {
    const lastmod = new Date().toISOString()
    return [
      { loc: '/', lastmod },
      { loc: '/en', lastmod },
      { loc: '/ko', lastmod },
      { loc: '/en/promotion', lastmod },
      { loc: '/ko/promotion', lastmod },
      { loc: '/en/forgot-password', lastmod },
      { loc: '/ko/forgot-password', lastmod }
    ]
  }
}
