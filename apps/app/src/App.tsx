import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import NotFound from './common/NotFound'
import Layout from './components/Layout'
import { ENV_CONFIG } from './config/env.config'
import Challenges from './pages/Challenges'
import Data from './pages/Data'
import Friends from './pages/Friends'
import Home from './pages/Home'
import Landing from './pages/Landing'
import SignIn from './pages/Login'
import SignUp from './pages/Register'
import Settings from './pages/Setting'
import Faqs from './pages/faqs/Faqs'
import { utils } from './utils'

function App() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [routeType, setRouteType] = useState(utils.helpers.getRouteType(pathname))

    useEffect(() => {
        const urlPrefix = ENV_CONFIG.URL_PREFIX
        const updatedPathname = utils.string.removeTrailingSlash(pathname)

        if (urlPrefix && pathname === '/') {
            navigate(utils.helpers.getRoute('/'))
            return
        }

        setRouteType(utils.helpers.getRouteType(updatedPathname))
        window.scrollTo(0, 0)
    }, [pathname, navigate])

    // Protected routes - require login
    if (routeType.protected) {
        return (
            <Routes>
                <Route path={utils.helpers.getRoute('/app')} element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path={utils.helpers.getRoute('/app/data')} element={<Data />} />
                    <Route path={utils.helpers.getRoute('/app/friends')} element={<Friends />} />
                    <Route path={utils.helpers.getRoute('/app/challenges')} element={<Challenges />} />
                    <Route path={utils.helpers.getRoute('/app/settings')} element={<Settings />} />
                    <Route path={utils.helpers.getRoute('/app/faqs')} element={<Faqs />} />
                </Route>
            </Routes>
        )
    }

    // Public routes - no login required
    return (
        <Routes>
            {/* Landing Page */}
            <Route path='/' element={<Landing />} />
            
            {/* Auth Routes */}
            <Route path='/auth/signin' element={<SignIn />} />
            <Route path='/auth/signup' element={<SignUp />} />
            
            {/* 404 */}
            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}

export default App
