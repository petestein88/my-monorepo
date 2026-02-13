import DeviceModal from '../modals/DeviceModal'
import { useModal } from '../providers/ModalProvider'
import ForgotPasswordModal from '../modals/ForgotPasswordModal'
import ResetPasswordModal from '../modals/ResetPasswordModal'
import UpdatePasswordModal from '../modals/UpdatePasswordModal'
import AlertModal from '../modals/AlertModal'
import InfoModal from '../modals/InfoModal'
import UserSearchModal from '../modals/SearchModal'

const ModalLayout = () => {
    const modalsContext = useModal()
    const modals = modalsContext.modals

    return (
        <>
            {modals.alert && <AlertModal />}
            {modals.updatePassword && <UpdatePasswordModal />}
            {modals.forgotPassword && <ForgotPasswordModal />}
            {modals.resetPassword && <ResetPasswordModal />}
            {modals.device && <DeviceModal />}
            {modals.info && <InfoModal />}
            {modals.search && <UserSearchModal />}
        </>
    )
}

export default ModalLayout
