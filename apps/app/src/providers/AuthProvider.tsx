import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Loader from '../common/Loader'
import { LOCAL_STORAGE_ENUM } from '../enums/common.enum'
import { utils } from '../utils'
import { http } from '../utils/http'
import { useModal } from './ModalProvider'
import InterceptorProvider from './InterceptorProvider'
import ModalLayout from '../layout/ModalLayout'

type IAuthState = 'loading' | 'authenticated' | 'unauthenticated' | 'error'

type IUser = {
    phone_number: string
    device_id: string
    id: number
    first_name: string
    last_name: string
    email: string
}

type IAuthProviderContext = {
    loading: boolean
    user: IUser | null
    update: (token?: string) => void
    fetchUser: () => Promise<void>
    setUser: React.Dispatch<React.SetStateAction<IUser>>
    setAuthState: React.Dispatch<React.SetStateAction<IAuthState>>
}

type IAuthProviderProps = PropsWithChildren & {}

const AuthProviderContext = createContext<IAuthProviderContext>({
    loading: true,
    user: null,
    update: _ => {},
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

    useEffect(() => {
        const token = utils.helpers.auth.isUserLoggedIn()
        if (token) {
            fetchUser()
        } else {
            setAuthState('unauthenticated')
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (authState !== 'loading') {
            if (routeType.protected && !user) {
                navigate(utils.helpers.getRoute('/auth/signin'))
            } else if (routeType.unprotected && user) {
                navigate(utils.helpers.getRoute('/'))
            }
        }
    }, [routeType, pathname, authState, user])

    useEffect(() => {
        if (!user) {
            return
        }

        const openAddSlotModal = localStorage.getItem('open-add-slot-modal') === 'true'

        if (openAddSlotModal) {
            modalContext.openModal({
                type: 'device',
                props: {
                    visible: true
                }
            })
        }
    }, [user])

    const update = (newToken?: string) => {
        if (newToken) {
            localStorage.setItem(LOCAL_STORAGE_ENUM.AUTH_TOKEN, newToken)
        }
        setTimeout(fetchUser, 100)
    }

    const fetchUser = useCallback(async () => {
        try {
            const response = await http({
                url: 'user/me',
                method: 'GET'
            })

            if (!response.data.user) {
                return
            }

            setUser(response.data.user)
            setAuthState('authenticated')
        } catch (error) {
            setAuthState('error')
            utils.toast.error(utils.error.handler(error))
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    const checkLoading = () => {
        return loading || ['loading', 'error'].includes(authState)
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
