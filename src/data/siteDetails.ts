export const siteDetails = {
    siteName: 'Newman Coding Club',
    siteUrl: 'https://newmancoding.club/',
    metadata: {
        title: 'Newman Coding Club - Learn, Build, Connect at Newman University Wichita',
        description: 'Join our community at Newman University Wichita to learn coding, build projects, and explore computer science in a supportive environment. No prior experience needed!',
    },
    language: 'en-us',
    locale: 'en-US',
    siteLogo: `${process.env.BASE_PATH || ''}/images/logo.png`,
    googleAnalyticsId: `${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''}`,
}