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
import { http } from '../utils/http'
import { useAuthProviderContext } from '../providers/AuthProvider'

type IFormData = (typeof schemas.signUpSchema)['__outputType']

const SignIn: React.FC = () => {
    const { fetchUser } = useAuthProviderContext()
    const { handleGoogleLoginFailure, handleGoogleLoginSuccess } = useAuth()

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
        resolver: yupResolver(schemas.signUpSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
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

                const { first_name, last_name, email } = JSON.parse(decryptedToken) as {
                    email: string
                    first_name: string
                    last_name: string
                }

                reset({
                    email,
                    first_name,
                    last_name
                })
            } catch (error: unknown) {
                utils.toast.error(utils.error.handler(error))
            }
        }
    }, [token, mode, reset])

    const onSubmit: SubmitHandler<IFormData> = async credentials => {
        setLoading(true)
        try {
            const { data } = await http({
                url: '/auth/signup',
                method: 'POST',
                data: credentials
            })

            localStorage.setItem(LOCAL_STORAGE_ENUM.AUTH_TOKEN, data.token)
            localStorage.setItem(LOCAL_STORAGE_ENUM.OPEN_ADD_SLOT_MODAL, 'true')
            fetchUser()
            utils.toast.success({ message: 'Signup successfully' })
            navigate(utils.helpers.getRoute('/'))
        } catch (error: unknown) {
            utils.toast.error(utils.error.handler(error))
        } finally {
            setLoading(false)
        }
    }

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)

    return (
        <AuthLayout title='Sign Up to'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex gap-2 justify-between mb-4'>
                    <Controller
                        name='first_name'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
                                label='First Name'
                                placeholder='Enter first name'
                                error={errors.first_name?.message}
                                icon={<i className='text-[22px] tabler-user-square-rounded text-gray-400' />}
                            />
                        )}
                    />

                    <Controller
                        name='last_name'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
                                label='Last Name'
                                iconPosition='start'
                                placeholder='Enter last name'
                                icon={<i className='text-[22px] tabler-user-square-rounded text-gray-400' />}
                                error={errors.last_name?.message}
                            />
                        )}
                    />
                </div>
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
                            wrapperClassName='mb-6'
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

                <div className='mb-5  flex flex-col items-center justify-center'>
                    <Button label='Sign Up' loading={loading} sizeVariant='md' className='max-w-[400px] w-[80%]' />

                    <div className='flex justify-center my-4 rounded-lg'>
                        <GoogleAuthButton
                            handleGoogleLoginSuccess={handleGoogleLoginSuccess}
                            handleGoogleLoginFailure={handleGoogleLoginFailure}
                        />
                    </div>

                    <div className='flex justify-center items-center flex-wrap text-black text-sm font-normal mt-2'>
                        Already have an account? Please&nbsp;
                        <Link
                            to={utils.helpers.getRoute('/auth/signin')}
                            className='text-primary font-semibold hover:underline'
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </form>
        </AuthLayout>
    )
}

export default SignIn
