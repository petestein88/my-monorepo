import { useModal } from '../providers/ModalProvider'
import ModalWrapper from './ModalWrapper'

const InfoModal = () => {
    const modalContext = useModal()
    const info = modalContext.modals.info
    const handleClose = () => modalContext.closeModal('info')

    const contentList = [
        'Track your daily phone usage and see your progress over time',
        'Set personal goals and challenge yourself to reduce screen time',
        'Join group challenges and compete with friends',
        'Create team challenges and work together towards common goals',
        'Earn rewards and recognition for achieving your goals',
        'Connect with a community of like-minded individuals'
    ]
    return (
        <ModalWrapper
            preventCloseOnOutsideClick={info.disableOutsideClick}
            heading={info?.heading || 'Getting Started'}
            handleClose={handleClose}
        >
            <div className='prose max-w-none'>
                <p className='text-gray-700 leading-relaxed'>With the device and this platform, you can:</p>
                <ul className='list-disc pl-5 space-y-2 text-gray-700'>
                    {contentList.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        </ModalWrapper>
    )
}

export default InfoModal
