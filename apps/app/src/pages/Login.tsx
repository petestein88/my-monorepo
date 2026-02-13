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

type IFormData = (typeof schemas.signInSchema)['__outputType']

const SignIn: React.FC = () => {
    const navigate = useNavigate()
    const { fetchUser } = useAuthProviderContext()

    const [loading, setLoading] = useState(false)
    const [isPasswordShown, setIsPasswordShown] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<IFormData>({
        resolver: yupResolver(schemas.signInSchema),
        defaultValues: {
            password: '',
            email: ''
        }
    })

    const onSubmit: SubmitHandler<IFormData> = async credentials => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password
            })

            if (error) throw error

            await fetchUser()
            utils.toast.success({ message: 'Login successful' })
            navigate(utils.helpers.getRoute('/app'))
        } catch (error: any) {
            console.error('SignIn error', error)
            const message = error?.message ?? 'Sign in failed'
            utils.toast.error({ message })
        } finally {
            setLoading(false)
        }
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

                <div className='mb-4 flex flex-col items-center justify-center'>
                    <Button label='Sign In' loading={loading} sizeVariant='md' className='max-w-[400px] w-[80%]' />

                    <div className='flex justify-center items-center flex-wrap text-black text-sm font-normal mt-3'>
                        Don’t have an account?&nbsp;
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
