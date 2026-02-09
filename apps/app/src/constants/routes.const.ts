import { ENV_CONFIG } from '../config/env.config'

const PROTECTED_ROUTES = [
    { NAME: 'Home', URL: `${ENV_CONFIG.URL_PREFIX}` },
    { NAME: 'Data', URL: `${ENV_CONFIG.URL_PREFIX}/data` },
    { NAME: 'Friends', URL: `${ENV_CONFIG.URL_PREFIX}/friends` },
    { NAME: 'Challenges', URL: `${ENV_CONFIG.URL_PREFIX}/challenges` },
    { NAME: 'Faq', URL: `${ENV_CONFIG.URL_PREFIX}/faqs` },
    { NAME: 'Setting', URL: `${ENV_CONFIG.URL_PREFIX}/settings` }
]

const UN_PROTECTED_ROUTES = [
    { NAME: 'Signin', URL: `${ENV_CONFIG.URL_PREFIX}/auth/signin` },
    { NAME: 'Signup', URL: `${ENV_CONFIG.URL_PREFIX}/auth/signup` }
]

const PUBLIC_ROUTES = [
    { NAME: '404', URL: `${ENV_CONFIG.URL_PREFIX}/*` } // Catch-all for unknown routes
]

const ROUTES = {
    PROTECTED_ROUTES,
    UN_PROTECTED_ROUTES,
    PUBLIC_ROUTES
}

export { ROUTES }
