import * as yup from 'yup'

//  Reusable field schemas
const emailSchema = yup
    .string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email')
    .required('Please provide a valid email')

const passwordSchema = yup
    .string()
    .required('Please enter your password')
    .min(5, 'Password must be at least 5 characters long')

const firstNameSchema = yup
    .string()
    .trim()
    .min(1, 'Please enter your first name  ')
    .required('Please enter your first name  ')

const lastNameSchema = yup.string().trim().min(1, 'Please enter your last name').required('Please enter your last name')

const phoneSchema = yup
    .string()
    .max(15, 'Phone number must be at most 15 characters')
    .nullable()
    .transform(value => (value === '' ? null : value))

// ✅ Authentication schemas
const signInSchema = yup.object().shape({
    email: emailSchema,
    password: passwordSchema
})

const signUpSchema = yup.object().shape({
    first_name: firstNameSchema,
    last_name: lastNameSchema,
    email: emailSchema,
    password: passwordSchema
})

const updatePasswordSchema = yup.object().shape({
    oldPassword: yup.string().trim().required('Please enter your old password'),
    newPassword: passwordSchema,
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Please ensure both passwords are the same')
        .required('Please re-enter your password for confirmation')
})

const forgotPasswordSchema = yup.object().shape({
    email: emailSchema
})

const resetPasswordWithConfirmSchema = yup.object().shape({
    password: passwordSchema,
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Please ensure both passwords are the same')
        .required('Please ensure both passwords are the same')
})

//  User-related schemas
const updateDisplayNameSchema = yup.object().shape({
    first_name: firstNameSchema,
    last_name: lastNameSchema,
    email: emailSchema,
    phone_number: phoneSchema
})

//  Device schemas
const addUpdateDeviceSchema = yup.object().shape({
    deviceId: yup.string().required('Device ID is a required field'),
    slot: yup.string().required('Slot is a required field')
})

const searchInputSchema = yup.object({
    search: yup.string().required('Please enter email or phone number')
})

//  Exporting all schemas
export const schemas = {
    signInSchema,
    signUpSchema,
    updatePasswordSchema,
    forgotPasswordSchema,
    resetPasswordWithConfirmSchema,
    updateDisplayNameSchema,
    addUpdateDeviceSchema,
    searchInputSchema
}
