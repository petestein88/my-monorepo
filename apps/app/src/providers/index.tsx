import { PropsWithChildren } from 'react'

import { BrowserRouter as Router } from 'react-router-dom'
import AuthProvider from './AuthProvider'
import ModalProvider from './ModalProvider'
import ToastProvider from './ToastProvider'

type IProvidersProps = {} & PropsWithChildren

const Providers = (props: IProvidersProps) => {
    return (
        <Router>
            <ModalProvider>
                <AuthProvider>{props.children}</AuthProvider>
                <ToastProvider />
            </ModalProvider>
        </Router>
    )
}

export default Providers
