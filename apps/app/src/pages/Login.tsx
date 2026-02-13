import { yupResolver } from '@hookform/resolvers/yup'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../common/Button'
import Input from '../common/Input'
import GoogleAuthButton from '../components/lib/@react-oauth/google/GoogleAuthButton'
import { CONST } from '../constants/index.const'
import { LOCAL_STORAGE_ENUM } from '../enums/common.enum'
import useAuth from '../hooks/useAuth'
import AuthLayout from '../layout/AuthLayout'
import { schemas } from '../schemas'
import { utils } from '../utils'
import { useModal } from '../providers/ModalProvider'
import { http } from '../utils/http'
import { useAuthProviderContext } from '../providers/AuthProvider'

type IFormData = (typeof schemas.signInSchema)['__outputType']

const SignIn: React.FC = () => {
    const { handleGoogleLoginFailure, handleGoogleLoginSuccess } = useAuth()

    const { fetchUser } = useAuthProviderContext()

    const modalContext = useModal()
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const [loading, setLoading] = useState(false)

    const [mode] = useState(params.get('mode') ?? null)
    const [token] = useState(params.get('token') ?? null)
    const [isPasswordShown, setIsPasswordShown] = useState(false)

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<IFormData>({
        resolver: yupResolver(schemas.signInSchema),
        defaultValues: {
            password: '',
            email: ''
        }
    })

    useEffect(() => {
        if (!token || !mode) return

        if (mode === 'verifyEmail') {
            try {
                const decryptedToken = utils.crypto.decrypt(token.replace(/\s/g, '+'))
                if (!decryptedToken) {
                    throw CONST.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG
                }

                const { email } = JSON.parse(decryptedToken) as {
                    currentEmail: string
                    email: string
                }

                reset({
                    email
                })
            } catch (error: unknown) {
                utils.toast.error(utils.error.handler(error))
            }
        }
    }, [token, mode, reset])

    useEffect(() => {
        if (token) {
            setTimeout(() => {
                modalContext.openModal({
                    type: 'resetPassword',
                    props: {
                        visible: true,
                        token
                    }
                })
            }, 0)
        }
    }, [token])

    const onSubmit: SubmitHandler<IFormData> = async credentials => {
        setLoading(true)
        try {
            const { data } = await http({
                url: 'auth/login',
                method: 'POST',
                data: credentials
            })

            localStorage.setItem(LOCAL_STORAGE_ENUM.AUTH_TOKEN, data.token)
            await fetchUser()
            utils.toast.success({ message: 'Login successful' })
            navigate(utils.helpers.getRoute('/'))
        } catch (error: unknown) {
            utils.toast.error(utils.error.handler(error))
            setLoading(false)
        }
    }

    const onForgotPasswordClick = () => {
        modalContext.openModal({
            type: 'forgotPassword',
            props: {
                visible: true
            }
        })
    }

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)
    return (
        <AuthLayout title='Sign In to'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            wrapperClassName='mb-4'
                            error={errors.email?.message}
                            label='Email'
                            {...field}
                            iconPosition='start'
                            type='email'
                            placeholder='Enter your email'
                            icon={<i className='text-[22px] tabler-mail text-gray-400' />}
                        />
                    )}
                />

                <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            wrapperClassName='mb-2'
                            error={errors.password?.message}
                            type={isPasswordShown ? 'text' : 'password'}
                            label='Password'
                            {...field}
                            iconPosition='start'
                            iconPositions='end'
                            placeholder='Enter your password'
                            icon={<i className='text-[22px] tabler-lock text-gray-400' />}
                            icons={
                                <i
                                    onClick={handleClickShowPassword}
                                    className={clsx(
                                        'cursor-pointer text-[22px]',
                                        !isPasswordShown ? 'tabler-eye-off' : 'tabler-eye',
                                        'text-gray-400'
                                    )}
                                />
                            }
                        />
                    )}
                />
                <div className='flex justify-end mb-4'>
                    <h4
                        className='cursor-pointer text-primary font-semibold text-sm hover:underline'
                        onClick={() => onForgotPasswordClick()}
                    >
                        Forgot Password?
                    </h4>
                </div>

                <div className='mb-4  flex flex-col items-center justify-center'>
                    <Button label='Sign In' loading={loading} sizeVariant='md' className='max-w-[400px] w-[80%]' />

                    <div className='flex justify-center my-4 rounded-lg'>
                        <GoogleAuthButton
                            handleGoogleLoginSuccess={handleGoogleLoginSuccess}
                            handleGoogleLoginFailure={handleGoogleLoginFailure}
                        />
                    </div>

                    <div className='flex justify-center items-center flex-wrap text-black text-sm font-normal mt-1'>
                        Already have an account? Please&nbsp;
                        <Link
                            to={utils.helpers.getRoute('/auth/signup')}
                            className='text-primary font-semibold hover:underline'
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </form>
        </AuthLayout>
    )
}

export default SignIn
