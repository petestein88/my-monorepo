/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { useModal } from '../providers/ModalProvider'
import { schemas } from '../schemas/index'
import { utils } from '../utils'
import Button from '.././common/Button'
import ModalWrapper from './ModalWrapper'
import Input from '../common/Input'
import { http } from '../utils/http'

type FormData = (typeof schemas.forgotPasswordSchema)['__outputType']

const ForgotPasswordModal = () => {
    // State
    const [loading, setLoading] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(schemas.forgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    })

    const modalContext = useModal()
    const handleClose = () => modalContext.closeModal('forgotPassword')

    const onSubmit: SubmitHandler<FormData> = async (credentials: FormData) => {
        setLoading(true)
        try {
            const response = await http({
                url: 'auth/forgot-password',
                method: 'POST',
                data: credentials
            })
            utils.toast.success({ message: response.data.message })

            modalContext.closeModal('forgotPassword')
        } catch (error: unknown) {
            setLoading(false)
            utils.toast.error({ message: 'User not found' })
        }
    }

    return (
        <ModalWrapper
            preventCloseOnOutsideClick={modalContext.modals.forgotPassword.disableOutsideClick}
            heading='Forgot Password'
            handleClose={handleClose}
            footer={<Button onClick={handleSubmit(onSubmit)} loading={loading} sizeVariant='sm' label='Reset' />}
        >
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
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
            </form>
        </ModalWrapper>
    )
}

export default ForgotPasswordModal
