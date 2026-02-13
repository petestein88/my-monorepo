import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Loader from '../common/Loader'
import { utils } from '../utils'
import { useModal } from './ModalProvider'
import InterceptorProvider from './InterceptorProvider'
import ModalLayout from '../layout/ModalLayout'
import { supabase } from '../config/supabase'
import type { Session } from '@supabase/supabase-js'

type IAuthState = 'loading' | 'authenticated' | 'unauthenticated' | 'error'

type IUser = {
    id: string
    email: string
    first_name?: string
    last_name?: string
    phone_number?: string
    device_id?: string
}

type IAuthProviderContext = {
    loading: boolean
    user: IUser | null
    update: () => Promise<void>
    fetchUser: () => Promise<void>
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>
    setAuthState: React.Dispatch<React.SetStateAction<IAuthState>>
}

type IAuthProviderProps = PropsWithChildren & {}

const AuthProviderContext = createContext<IAuthProviderContext>({
    loading: true,
    user: null,
    update: async () => {},
    fetchUser: async () => {},
    setUser: () => {},
    setAuthState: () => {}
})

const useAuthProviderContext = () => useContext(AuthProviderContext)

const AuthProvider = (props: IAuthProviderProps) => {
    const modalContext = useModal()

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<IUser | null>(null)
    const [authState, setAuthState] = useState<IAuthState>('loading')

    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [routeType, setRouteType] = useState(utils.helpers.getRouteType(pathname))

    useEffect(() => {
        setRouteType(utils.helpers.getRouteType(utils.string.removeTrailingSlash(pathname)))
        window.scrollTo(0, 0)
    }, [pathname])

    const applySession = useCallback((session: Session | null) => {
        if (!session?.user) {
            setUser(null)
            setAuthState('unauthenticated')
            return
        }

        const meta = (session.user.user_metadata ?? {}) as Record<string, any>

        setUser({
            id: session.user.id,
            email: session.user.email ?? '',
            first_name: meta.first_name,
            last_name: meta.last_name
        })
        setAuthState('authenticated')
    }, [])

    const fetchUser = useCallback(async () => {
        try {
            const { data, error } = await supabase.auth.getSession()
            if (error) throw error

            applySession(data.session)
        } catch (error: any) {
            // IMPORTANT: "Auth session missing!" is normal when the user is simply logged out.
            // We treat that as unauthenticated (no toast) to avoid confusing banners.
            const message = String(error?.message ?? '')
            if (message.toLowerCase().includes('auth session missing')) {
                setUser(null)
                setAuthState('unauthenticated')
            } else {
                setAuthState('error')
                utils.toast.error({ message: error?.message ?? 'Authentication error' })
                console.error('AuthProvider.fetchUser error', error)
            }
        } finally {
            setLoading(false)
        }
    }, [applySession])

    const update = async () => {
        setLoading(true)
        await fetchUser()
    }

    useEffect(() => {
        // Initial session check + keep in sync
        fetchUser()

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            applySession(session)
            setLoading(false)
        })

        return () => {
            data.subscription.unsubscribe()
        }
    }, [fetchUser, applySession])

    useEffect(() => {
        if (authState !== 'loading') {
            if (routeType.protected && !user) {
                navigate(utils.helpers.getRoute('/auth/signin'))
            } else if (routeType.unprotected && user) {
                navigate(utils.helpers.getRoute('/app'))
            }
        }
    }, [routeType, pathname, authState, user, navigate])

    useEffect(() => {
        if (!user) return

        const openAddSlotModal = localStorage.getItem('open-add-slot-modal') === 'true'

        if (openAddSlotModal) {
            modalContext.openModal({
                type: 'device',
                props: {
                    visible: true
                }
            })
        }
    }, [user, modalContext])

    const checkLoading = () => {
        return loading || authState === 'loading'
    }

    return (
        <AuthProviderContext.Provider
            value={{
                loading: checkLoading(),
                user,
                update,
                fetchUser,
                setUser,
                setAuthState
            }}
        >
            {checkLoading() ? (
                <Loader isPageLoader={true} />
            ) : routeType.protected && authState === 'unauthenticated' ? null : (
                props.children
            )}
            <InterceptorProvider />
            <ModalLayout />
        </AuthProviderContext.Provider>
    )
}

export default AuthProvider

export { useAuthProviderContext }
