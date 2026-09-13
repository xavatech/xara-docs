export default defineNuxtConfig({
  extends: ['docus'],
  routeRules: {
    '/': {
      redirect: {
        to: '/getting-started/overview',
        statusCode: 302,
      },
    },
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'theme-color', content: '#009f61' },
      ],
    },
  },
  site: {
    name: 'Xara API',
  },
  llms: {
    title: 'Xara API documentation',
    description: 'Integrate Xara products, invoices, ticketing and payment webhooks.',
    full: {
      title: 'Xara API documentation',
      description: 'Complete developer documentation for the Xara Business API.',
    },
  },
})
