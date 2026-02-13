import cryptoJS from 'crypto-js'

import { ENV_CONFIG } from '../config/env.config'

const key = ENV_CONFIG.VITE_APP_SECRET_KEY

function encrypt(data: string): string {
    const encryptedData = cryptoJS.AES.encrypt(data, key).toString()
    return encryptedData
}

function decrypt(encryptedData: string): string {
    const decryptedData = cryptoJS.AES.decrypt(encryptedData, key).toString(cryptoJS.enc.Utf8)
    return decryptedData
}

export const crypto = {
    encrypt,
    decrypt
}
