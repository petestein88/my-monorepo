'use client'

import { createContext, PropsWithChildren, useContext, useEffect } from 'react'

import { useModal } from './ModalProvider'
import { STATE_ENUM } from '../enums/common.enum'
import useLogout from '../hooks/useLogout'

type IInterceptorProviderContext = {}

type IInterceptorProviderProps = PropsWithChildren & {}

const InterceptorProviderContext = createContext<IInterceptorProviderContext>({})

const useInterceptorProviderContext = () => useContext(InterceptorProviderContext)

const InterceptorProvider = (props: IInterceptorProviderProps) => {
    // States
    const modalContext = useModal()
    const { logout } = useLogout()

    // Hooks

    useEffect(() => {
        const handleEvent = (e: Event) => {
            if (e instanceof CustomEvent) {
                if (e.detail?.logout) {
                    modalContext.resetModalsState()
                    modalContext.openModal({
                        type: 'alert',
                        props: {
                            status: STATE_ENUM.IDLE,
                            heading: 'Alert',
                            disableOutsideClick: true,
                            description: e.detail?.error,
                            onOkClick: async () => {
                                await logout(true)
                            },
                            visible: true,
                            okButtonText: 'Logout'
                        }
                    })
                }
            }
        }

        window.addEventListener('httpInterceptor', handleEvent)

        return () => {
            window.removeEventListener('httpInterceptor', handleEvent)
        }
    }, [modalContext])

    return <InterceptorProviderContext.Provider value={{}}>{props.children}</InterceptorProviderContext.Provider>
}

export default InterceptorProvider

export { useInterceptorProviderContext }
