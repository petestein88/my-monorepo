import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import useAuth from '../../../../hooks/useAuth'

type GoogleAuthButtonProps = ReturnType<typeof useAuth>

const GoogleAuthButton = (props: GoogleAuthButtonProps) => {
    const { handleGoogleLoginFailure, handleGoogleLoginSuccess } = props

    return (
        <GoogleOAuthProvider clientId='your_google_client_id'>
            <div className='google-login'>
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginFailure}
                    logo_alignment='center'
                    text='continue_with'
                />
            </div>
        </GoogleOAuthProvider>
    )
}

export default GoogleAuthButton
