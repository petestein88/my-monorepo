/* eslint-disable @typescript-eslint/no-unused-vars */

// React Imports

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import clsx from 'clsx'
import { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import Button from '../common/Button'
import Input from '../common/Input'
import { RESPONSE_MESSAGES } from '../constants/responseMessages.const'
import ModalWrapper from './ModalWrapper'

// Third-party Imports
import { useAuthProviderContext } from '../providers/AuthProvider'
import { useModal } from '../providers/ModalProvider'
import { schemas } from '../schemas'
import { utils } from '../utils'
import { http } from '../utils/http'

type IFormData = (typeof schemas.updatePasswordSchema)['__outputType']

const UpdatePasswordModal = () => {
    // States
    const [loading, setLoading] = useState(false)
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isCPasswordShown, setCIsPasswordShown] = useState(false)
    const [isOPasswordShown, setOIsPasswordShown] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<IFormData>({
        resolver: yupResolver(schemas.updatePasswordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    })

    // Hooks
    const modalContext = useModal()

    const { update } = useAuthProviderContext()

    const handleClose = () => modalContext.closeModal('updatePassword')

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)

    const handleoClickShowPassword = () => setOIsPasswordShown(show => !show)

    const handlecClickShowPassword = () => setCIsPasswordShown(show => !show)

    const onSubmit: SubmitHandler<IFormData> = async formData => {
        try {
            setLoading(true)

            const { confirmPassword, ...requestData } = formData

            const response = await http({
                url: 'user/password',
                method: 'PATCH',
                data: requestData
            })

            update(response.data.user.token)

            utils.toast.success({
                message: RESPONSE_MESSAGES._UPDATED_SUCCESSFULLY.replace('[ITEM]', 'Password')
            })

            handleClose()
        } catch (error: any) {
            setLoading(false)
            utils.toast.error(utils.error.handler(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <ModalWrapper
            preventCloseOnOutsideClick={modalContext.modals.updatePassword.disableOutsideClick}
            handleClose={handleClose}
            heading='Update Password'
            footer={
                <div className='flex justify-end'>
                    <Button
                        type='button'
                        className='max-w-[100px]'
                        loading={loading}
                        onClick={handleSubmit(onSubmit)}
                        label='Update'
                    />
                </div>
            }
        >
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                <Controller
                    name='oldPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            iconPosition='end'
                            type={isOPasswordShown ? 'text' : 'password'}
                            error={errors.oldPassword?.message}
                            placeholder='Enter old password'
                            icon={
                                <i
                                    onClick={handleoClickShowPassword}
                                    className={clsx(
                                        'cursor-pointer text-[22px]',
                                        !isOPasswordShown ? 'tabler-eye-off' : 'tabler-eye',
                                        'text-gray-600'
                                    )}
                                />
                            }
                        />
                    )}
                />

                <Controller
                    name='newPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            iconPosition='end'
                            type={isPasswordShown ? 'text' : 'password'}
                            error={errors.newPassword?.message}
                            placeholder='Enter new password'
                            icon={
                                <i
                                    onClick={handleClickShowPassword}
                                    className={clsx(
                                        'cursor-pointer text-[22px]',
                                        !isPasswordShown ? 'tabler-eye-off' : 'tabler-eye',
                                        'text-gray-600'
                                    )}
                                />
                            }
                        />
                    )}
                />

                <Controller
                    name='confirmPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            iconPosition='end'
                            type={isCPasswordShown ? 'text' : 'password'}
                            error={errors.confirmPassword?.message}
                            placeholder='Enter password again'
                            icon={
                                <i
                                    onClick={handlecClickShowPassword}
                                    className={clsx(
                                        'cursor-pointer text-[22px]',
                                        !isCPasswordShown ? 'tabler-eye-off' : 'tabler-eye',
                                        'text-gray-600'
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

export default UpdatePasswordModal
