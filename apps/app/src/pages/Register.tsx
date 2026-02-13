import { yupResolver } from '@hookform/resolvers/yup'
import clsx from 'clsx'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import Input from '../common/Input'
import AuthLayout from '../layout/AuthLayout'
import { schemas } from '../schemas'
import { utils } from '../utils'
import { supabase } from '../config/supabase'
import { useAuthProviderContext } from '../providers/AuthProvider'

type IFormData = (typeof schemas.signUpSchema)['__outputType']

const SignUp: React.FC = () => {
    const navigate = useNavigate()
    const { fetchUser } = useAuthProviderContext()

    const [loading, setLoading] = useState(false)
    const [isPasswordShown, setIsPasswordShown] = useState(false)

    const {
        control,
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

    const onSubmit: SubmitHandler<IFormData> = async credentials => {
        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signUp({
                email: credentials.email,
                password: credentials.password,
                options: {
                    data: {
                        first_name: credentials.first_name,
                        last_name: credentials.last_name
                    }
                }
            })

            if (error) throw error

            // If email confirmation is off, you typically get a session immediately.
            if (data.session) {
                await fetchUser()
                utils.toast.success({ message: 'Account created' })
                navigate(utils.helpers.getRoute('/app'))
                return
            }

            utils.toast.success({ message: 'Account created. Please sign in.' })
            navigate(utils.helpers.getRoute('/auth/signin'))
        } catch (error: any) {
            console.error('SignUp error', error)
            const message = error?.message ?? 'Sign up failed'
            utils.toast.error({ message })
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

                <div className='mb-5 flex flex-col items-center justify-center'>
                    <Button label='Sign Up' loading={loading} sizeVariant='md' className='max-w-[400px] w-[80%]' />

                    <div className='flex justify-center items-center flex-wrap text-black text-sm font-normal mt-3'>
                        Already have an account?&nbsp;
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

export default SignUp
