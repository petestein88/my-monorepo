import ModalWrapper from './ModalWrapper'
import Button from '../common/Button'
import { STATE_ENUM } from '../enums/common.enum'
import { useModal } from '../providers/ModalProvider'
import { utils } from '../utils'

const AlertModal = () => {
    const modalContext = useModal()
    const alert = modalContext.modals.alert

    const handleClose = () => {
        modalContext.closeModal('alert')
    }

    const onOkButtonClick = async () => {
        try {
            if (alert) {
                modalContext.openModal({
                    type: 'alert',
                    props: { ...alert, status: STATE_ENUM.LOADING }
                })
            }
            await alert?.onOkClick?.()
            modalContext.closeModal('alert')
        } catch (error) {
            utils.toast.error(utils.error.getMessage(error))
        }
    }

    return (
        <>
            <ModalWrapper
                preventCloseOnOutsideClick={alert.disableOutsideClick}
                handleClose={handleClose}
                heading={alert?.heading ?? 'Alert'}
                footer={
                    <div className='flex items-center rounded-b'>
                        {alert?.cancelButtonText ? (
                            <Button type='button' onClick={handleClose} label={alert?.cancelButtonText} />
                        ) : null}
                        <Button
                            type='button'
                            color={alert?.forDeletion ? 'error' : undefined}
                            onClick={onOkButtonClick}
                            loading={alert?.status === 'loading'}
                            label={alert?.okButtonText ?? 'Yes'}
                        />
                    </div>
                }
            >
                {/* Modal body */}
                <div className='p-4 space-y-4'>
                    <p className='text-[16px] leading-relaxed text-gray-500 text-center'>{alert?.description}</p>
                </div>
            </ModalWrapper>
        </>
    )
}

export default AlertModal
