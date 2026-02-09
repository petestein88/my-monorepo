import { AxiosError } from 'axios'
import { CONST } from '../constants/index.const'

const getMessage = (message: any, isError = true): { message: string } => {
    if (typeof message === 'string') {
        return { message }
    }

    return {
        message: message?.message ?? (isError ? CONST.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG : '')
    }
}

const handler = (error: any) => {
    if (error) {
        if (typeof error?.error === 'string') {
            error = error.error
        } else if (error instanceof AxiosError) {
            error.message = error.response.data?.error
        } else {
            error.message = CONST.POSTGRES.ERROR?.[error.code as keyof typeof CONST.POSTGRES.ERROR]?.message
        }
    }
    return getMessage(error, true)
}

export const error = {
    handler,
    getMessage
}
