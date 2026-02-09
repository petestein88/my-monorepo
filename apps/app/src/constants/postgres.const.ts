const ERROR = {
    'auth/user-not-found': {
        message: 'No user found with the provided email address. Please check and try again.'
    },
    'auth/wrong-password': {
        message: 'The password is incorrect. Please try again or reset your password.'
    },
    'auth/email-already-in-use': {
        message: 'The email address is already in use by another account. Please use a different email or login.'
    },
    'auth/invalid-email': {
        message: 'The email address is not valid. Please enter a valid email address.'
    },
    'auth/weak-password': {
        message: 'The password is too weak. Please use a stronger password.'
    },
    'auth/user-disabled': {
        message: 'The user account has been disabled. Please contact support for more information.'
    },
    'auth/requires-recent-login': {
        message: 'This operation requires a recent login. Please log in again and try the action.'
    },
    'auth/too-many-requests': {
        message: 'We have detected too many requests from your device. Please try again later.'
    },
    'auth/operation-not-allowed': {
        message: 'This operation is not allowed. Please enable it in the Firebase console.'
    },
    'auth/invalid-credential': {
        message: 'Invalid login credentials. Please check and try again.'
    },
    'auth/network-request-failed': {
        message: 'Network request failed. Please check your internet connection and try again.'
    },
    'auth/popup-closed-by-user': {
        message: 'The popup was closed before completing the sign in. Please try again.'
    },
    'auth/account-exists-with-different-credential': {
        message:
            'An account already exists with the same email address but different sign-in credentials. Please try using a different sign-in method.'
    },
    'auth/invalid-verification-code': {
        message: 'The verification code is invalid. Please check the code and try again.'
    },
    'auth/missing-verification-code': {
        message: 'Verification code is missing. Please provide a valid verification code.'
    },
    'auth/credential-already-in-use': {
        message: 'This credential is already associated with a different user account.'
    }
}

const POSTGRES = {
    ERROR
}

export { POSTGRES }
