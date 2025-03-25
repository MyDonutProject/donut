module.exports = {
  locales: ['pt', 'fr', 'es', 'en', 'de'],
  defaultLocale: 'en',
  loadLocaleFrom: (lang, ns) =>
    import(`./locales/${lang}/${ns}.json`).then(m => m.default),
  pages: {
    '*': ['common', 'data-grid', 'seo'],
  },
};
