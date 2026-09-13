export default defineAppConfig({
  header: {
    title: 'Xara Business API',
    logo: {
      light: '/logo/xara-business-green.png',
      dark: '/logo/xara-business-green-dark.png',
      favicon: '/favicon.ico',
      alt: 'Xara Business API',
      class: 'h-[24px] w-auto',
    },
  },
  seo: {
    titleTemplate: '%s · Xara API',
    title: 'Xara API documentation',
    description: 'Build products, invoices, ticketing and payment experiences with Xara.',
    schema: {
      type: 'SoftwareApplication',
      applicationCategory: 'DeveloperApplication',
      price: 0,
      organization: {
        name: 'Xara',
        url: 'https://usexara.ai',
        logo: '/logo/xara-business-green.png',
      },
    },
  },
  github: false,
  toc: {
    title: 'On this page',
  },
  ui: {
    colors: {
      primary: 'xara',
      neutral: 'slate',
    },
  },
})
