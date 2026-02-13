import { ReactNode } from 'react'
import { IBreakPoints, IStatus } from '../types'

type IBaseDialogProps = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    onClose?: Function
    visible: boolean
    disableOutsideClick?: boolean
}

export interface IInitialModalState {
    alert:
        | ({
              maxWidth?: IBreakPoints
              heading: string
              description: string | ReactNode
              okButtonText?: string
              okButtonLoadingText?: string
              forDeletion?: boolean
              cancelButtonText?: string | null
              status: IStatus
              onOkClick?: ((args?: any) => Promise<any>) | ((args?: any) => any) | null
              onCancelClick?: ((args?: any) => Promise<any>) | ((args?: any) => any) | null
          } & IBaseDialogProps)
        | null
    updatePassword: ({} & IBaseDialogProps) | null
    passwordPrompt:
        | ({
              onProceed: (user: any) => void
          } & IBaseDialogProps)
        | null
    resetPassword:
        | ({
              token: string
              isInvitationToken?: boolean
          } & IBaseDialogProps)
        | null
    forgotPassword: ({} & IBaseDialogProps) | null
    info:
        | ({
              html: ReactNode
              heading: string
              okButtonText?: string
              cancelButtonText?: string | null
              hidecancelbtn?: boolean
              onOkClick?: ((args?: any) => any) | null
              onCancelClick?: ((args?: any) => any) | null
          } & IBaseDialogProps)
        | null

    device:
        | ({
              onSuccess?: (message: string) => void
              deviceId?: any
              slot?: any
          } & IBaseDialogProps)
        | null

    search:
        | ({
              onSelectUser: (user: any) => void
          } & IBaseDialogProps)
        | null
}

export type ModalType = keyof IInitialModalState

export type ModalPropsMap = {
    [K in keyof IInitialModalState]: Exclude<IInitialModalState[K], null>
}
export type IModalContext = {
    resetModalsState: () => void
    openModal: <T extends ModalType>(args: { type: T; props: ModalPropsMap[T] }) => void
    modals: IInitialModalState
    closeModal: (args: ModalType) => void
}
