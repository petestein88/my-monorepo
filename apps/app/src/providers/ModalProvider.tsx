'use client'

import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'

import { IModalContext, ModalPropsMap, ModalType } from './types'

const modals_: IModalContext['modals'] = {
    alert: null,
    info: null,
    updatePassword: null,
    resetPassword: null,
    forgotPassword: null,
    passwordPrompt: null,
    device: null,
    search: null
}

export const ModalContext = createContext<IModalContext>({
    modals: modals_,
    openModal: (_: any) => {},
    closeModal: (_: any) => {},
    resetModalsState: () => {}
})

export const useModal = () => useContext(ModalContext)

const ModalProvider = (props: PropsWithChildren) => {
    const bodyRef = useRef<HTMLBodyElement | null>(null)

    const modalsRef = useRef(modals_)
    const [modals, setModals] = useState(modals_)

    useEffect(() => {
        bodyRef.current = document.querySelector('body')
    }, [])

    const openModal = <T extends ModalType>(args: { type: T; props: ModalPropsMap[T] }) => {
        const modals_ = { ...modalsRef.current }
        modals_[args.type] = args.props
        modalsRef.current = modals_
        if (bodyRef.current) {
            bodyRef.current.classList.add('no-scroll')
        }
        setModals(modalsRef.current)
    }

    const closeModal = (args: ModalType) => {
        modalsRef.current[args]?.onClose?.()
        const modals_ = { ...modalsRef.current }
        modals_[args] = null
        modalsRef.current = modals_
        if (bodyRef.current) {
            bodyRef.current.classList.remove('no-scroll')
        }
        setModals(modalsRef.current)
    }

    const resetModalsState = () => {
        modalsRef.current = { ...modals_ }
        setModals(modalsRef.current)
    }

    return (
        <ModalContext.Provider value={{ modals, openModal, closeModal, resetModalsState }}>
            {props.children}
        </ModalContext.Provider>
    )
}

export default ModalProvider
