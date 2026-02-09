import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import clsx from 'clsx'
import { utils } from '../utils'
import { schemas } from '../schemas'
import { useModal } from '../providers/ModalProvider'
import ModalWrapper from '../modals/ModalWrapper'
import Button from '../common/Button'
import Input from '../common/Input'
import { useNavigate } from 'react-router-dom'
import { http } from '../utils/http'

type FormData = (typeof schemas.resetPasswordWithConfirmSchema)['__outputType']

const ResetPasswordModal = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isCPasswordShown, setCIsPasswordShown] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(schemas.resetPasswordWithConfirmSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    })

    const modalContext = useModal()
    const resetPassword = modalContext.modals.resetPassword

    const handleClose = () => modalContext.closeModal('resetPassword')

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)
    const handlecClickShowPassword = () => setCIsPasswordShown(show => !show)

    const onSubmit = async (credentials: FormData) => {
        const token = resetPassword?.token
        if (!token) {
            utils.toast.error({ message: 'Token not found' })
            return
        }

        try {
            setLoading(true)

            const response = await http({
                url: 'auth/reset-password',
                method: 'POST',
                accessToken: token,
                data: {
                    password: credentials.password
                }
            })

            utils.toast.success({ message: response.data.message })
            navigate(utils.helpers.getRoute('/auth/signin'))
            modalContext.closeModal('resetPassword')
        } catch (error) {
            setLoading(false)
            utils.toast.error(utils.error.getMessage(error))
        }
    }

    return (
        <ModalWrapper
            preventCloseOnOutsideClick={resetPassword.disableOutsideClick}
            heading={resetPassword?.isInvitationToken ? "Let's Get Started..." : 'Reset Password'}
            handleClose={() => {
                handleClose()
            }}
            footer={
                <Button
                    onClick={handleSubmit(onSubmit)}
                    loading={loading}
                    sizeVariant='sm'
                    label={resetPassword?.isInvitationToken ? 'Set' : 'Reset'}
                />
            }
        >
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                {/* Password Field */}
                <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            wrapperClassName='mb-2'
                            error={errors.password?.message}
                            type={isPasswordShown ? 'text' : 'password'}
                            label='Password'
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

                {/* Confirm Password Field */}
                <Controller
                    name='confirmPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            wrapperClassName='mb-2'
                            error={errors.confirmPassword?.message}
                            type={isCPasswordShown ? 'text' : 'password'}
                            label='Confirm Password'
                            iconPosition='start'
                            iconPositions='end'
                            placeholder='Enter password again'
                            icon={<i className='text-[22px] tabler-lock text-gray-400' />}
                            icons={
                                <i
                                    onClick={handlecClickShowPassword}
                                    className={clsx(
                                        'cursor-pointer text-[22px]',
                                        !isCPasswordShown ? 'tabler-eye-off' : 'tabler-eye',
                                        'text-gray-400'
                                    )}
                                />
                            }
                        />
                    )}
                />
            </form>
        </ModalWrapper>
    )
}

export default ResetPasswordModal
