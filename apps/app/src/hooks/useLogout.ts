import { useState } from 'react'
import { LOCAL_STORAGE_ENUM, STATE_ENUM } from '../enums/common.enum'
import { useAuthProviderContext } from '../providers/AuthProvider'
import { useModal } from '../providers/ModalProvider'
import { utils } from '../utils'
import { http } from '../utils/http'

const useLogout = () => {
    const modalContext = useModal()
    const { setUser, setAuthState } = useAuthProviderContext()
    const [logoutLoading, setLogoutLoading] = useState(false)

    const logout = async (bypass = false) => {
        if (!bypass) {
            return modalContext.openModal({
                type: 'alert',
                props: {
                    maxWidth: 'xs',
                    heading: 'Alert',
                    description: 'Are you sure you want to logout?',
                    onOkClick: async () => {
                        await logout(true)
                    },
                    visible: true,
                    status: STATE_ENUM.IDLE,
                    okButtonText: 'Yes'
                }
            })
        }

        setLogoutLoading(true)

        try {
            try {
                await http({
                    url: 'auth/logout',
                    method: 'DELETE'
                })
            } catch (_) {}

            localStorage.removeItem(LOCAL_STORAGE_ENUM.AUTH_TOKEN)
            setAuthState('unauthenticated')
            setUser(null)

            utils.toast.success({ message: 'Logged out successfully' })
        } catch (error) {
            utils.toast.error(utils.error.handler(error))
            setLogoutLoading(false)
        }
    }

    return { logout, logoutLoading }
}

export default useLogout
