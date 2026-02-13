import { ENV_CONFIG } from '../config/env.config'

// Dashboard routes - require login
const PROTECTED_ROUTES = [
    { NAME: 'Home', URL: `/app` },
    { NAME: 'Data', URL: `/app/data` },
    { NAME: 'Friends', URL: `/app/friends` },
    { NAME: 'Challenges', URL: `/app/challenges` },
    { NAME: 'Faq', URL: `/app/faqs` },
    { NAME: 'Setting', URL: `/app/settings` }
]

// Auth routes - no login required
const UN_PROTECTED_ROUTES = [
    { NAME: 'Landing', URL: `/` },
    { NAME: 'Signin', URL: `/auth/signin` },
    { NAME: 'Signup', URL: `/auth/signup` }
]

// Catch-all
const PUBLIC_ROUTES = [
    { NAME: '404', URL: `/*` }
]

const ROUTES = {
    PROTECTED_ROUTES,
    UN_PROTECTED_ROUTES,
    PUBLIC_ROUTES
}

export { ROUTES }
