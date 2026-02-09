import { CredentialResponse } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { LOCAL_STORAGE_ENUM } from '../enums/common.enum'
import { utils } from '../utils'
import { http } from '../utils/http'

const useAuth = () => {
    const navigate = useNavigate()

    const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const { data } = await http({
                url: 'auth/google',
                method: 'PATCH',
                data: {
                    token: credentialResponse.credential
                }
            })
            localStorage.setItem(LOCAL_STORAGE_ENUM.AUTH_TOKEN, data.token)
            utils.toast.success({ message: 'Login successful' })
            navigate(utils.helpers.getRoute('/'))
        } catch (error: unknown) {
            utils.toast.error(utils.error.handler(error))
        }
    }

    const handleGoogleLoginFailure = () => {}

    return {
        handleGoogleLoginSuccess,
        handleGoogleLoginFailure
    }
}

export default useAuth
