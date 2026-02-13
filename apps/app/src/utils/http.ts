import type { AxiosHeaders, AxiosResponse, Method, RawAxiosRequestHeaders } from 'axios'
import axios, { AxiosError } from 'axios'
import { ENV_CONFIG } from '../config/env.config'
import { utils } from '.'
import { LOCAL_STORAGE_ENUM } from '../enums/common.enum'

type MethodsHeaders = Partial<
    {
        [Key in Method as Lowercase<Key>]: AxiosHeaders
    } & { common: AxiosHeaders }
>

type IHttpProps = {
    baseUrl?: string
    accessToken?: string | null
    headers?: (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders
    url: string
    method: string
    data?: object
    formData?: boolean
    abortSignal?: AbortSignal
}

const APP_PREFIX = ENV_CONFIG.BACKEND_APP_URL

const baseURL = `${APP_PREFIX}/api/`

const http = async (props: IHttpProps): Promise<AxiosResponse> => {
    return new Promise(async (resolve, reject) => {
        const Authorization = props?.accessToken ?? localStorage.getItem(LOCAL_STORAGE_ENUM.AUTH_TOKEN) ?? null

        const config = {
            baseURL: `${props.baseUrl ?? baseURL}${props?.url}`,
            method: props?.method,
            headers: {
                'Content-Type': props.formData ? 'multipart/form-data' : 'application/json',
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                ...(Authorization && {
                    Authorization: Authorization ? `Bearer ${Authorization}` : null
                }),
                ...(props.headers ?? {})
            },
            data: props?.data
        }

        try {
            const response = await axios({
                ...config,
                ...(props.abortSignal && { signal: props.abortSignal })
            })

            if (!response?.data) {
                throw new Error(response?.data?.message ?? utils.CONST.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG)
            }

            return resolve(response)
        } catch (error: unknown) {
            const event = new CustomEvent('httpInterceptor', {
                detail: (error as Record<string, Record<string, object>>).response?.data
            })
            window.dispatchEvent(event)
            if (error instanceof AxiosError) {
                return reject(error.response?.data)
            }
            return reject(error)
        }
    })
}

export { http }
