import { X } from 'lucide-react'
import { PropsWithChildren } from 'react'

type IModalWrapperProps = {
    heading: string
    handleClose: () => void
    footer?: React.ReactNode
    preventCloseOnOutsideClick: boolean
} & PropsWithChildren

const ModalWrapper = (props: IModalWrapperProps) => {
    const allowClose = props.preventCloseOnOutsideClick !== true

    return (
        <>
            {/* Main modal */}
            <div
                tabIndex={-1}
                aria-hidden='true'
                className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm'
                onClick={() => {
                    if (allowClose) props.handleClose()
                }}
            >
                <div className='relative w-full max-w-lg px-4' onClick={e => e.stopPropagation()}>
                    {/* Modal content */}
                    <div className='relative bg-white rounded-lg shadow-lg p-6 space-y-4'>
                        {/* Modal header */}
                        <div className='flex items-center justify-between'>
                            <h3 className='text-xl font-semibold text-secondary'>{props.heading}</h3>
                            {allowClose ? (
                                <button
                                    type='button'
                                    onClick={props.handleClose}
                                    className='text-sm text-gray-400 hover:text-gray-500 transition-colors'
                                >
                                    <X className='h-5 w-5' />
                                    <span className='sr-only'>Close modal</span>
                                </button>
                            ) : null}
                        </div>
                        {/* Modal body */}
                        <div>{props.children}</div>
                        {/* Modal footer */}
                        <div className='flex justify-end'>{props.footer}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalWrapper
