import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import Button from '../common/Button'
import Input from '../common/Input'
import { CONST } from '../constants/index.const'
import { useAuthProviderContext } from '../providers/AuthProvider'
import { useModal } from '../providers/ModalProvider'
import { schemas } from '../schemas'
import { utils } from '../utils'
import { http } from '../utils/http'

type IFormData = (typeof schemas.updateDisplayNameSchema)['__outputType']

const Settings = () => {
    const modalContext = useModal()
    const [loading, setLoading] = useState(false)
    const { user, update } = useAuthProviderContext()

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<IFormData>({
        resolver: yupResolver(schemas.updateDisplayNameSchema),
        defaultValues: {
            first_name: '',
            email: '',
            last_name: '',
            phone_number: ''
        }
    })

    useEffect(() => {
        reset({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            phone_number: user.phone_number || ''
        })
    }, [user, reset])

    const onSubmit: SubmitHandler<IFormData> = async formData => {
        setLoading(true)

        try {
            const response = await http({
                url: 'user/profile',
                method: 'PATCH',
                data: {
                    ...formData,
                    phone_number: formData.phone_number?.trim() || null
                }
            })

            if (response.data) {
                update()
            }

            utils.toast.success({
                message: CONST.RESPONSE_MESSAGES._UPDATED_SUCCESSFULLY.replace('[ITEM]', 'Profile')
            })
        } catch (error: any) {
            utils.toast.error(utils.error.handler(error))
        } finally {
            setLoading(false)
        }
    }

    const onUpdatePasswordClick = () => {
        modalContext.openModal({
            type: 'updatePassword',
            props: {
                visible: true
            }
        })
    }

    const onUpdateDeviceIdClick = () => {
        const [deviceId, slot] = user.device_id?.split('-') ?? []
        modalContext.openModal({
            type: 'device',
            props: {
                visible: true,
                deviceId,
                slot
            }
        })
    }

    return (
        <div className='space-y-6 bg-white shadow rounded-lg overflow-hidden px-4 py-5 sm:p-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <div className='flex gap-2 justify-between '>
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
                            wrapperClassName='mb-5.5'
                            className='mb-4'
                            error={errors.email?.message}
                            // disabled={true}
                            label='Email Address'
                            {...field}
                            type='text'
                            placeholder='Enter your email'
                            icon={<i className='text-[22px] tabler-mail text-gray-400' />}
                        />
                    )}
                />
                <Controller
                    name='phone_number'
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            wrapperClassName='mb-5.5'
                            className='max-w-[230px]'
                            label='Phone Number'
                            placeholder='Enter phone number'
                            error={errors.phone_number?.message}
                            icon={<i className='text-[22px] tabler-phone text-gray-400' />}
                        />
                    )}
                />

                <div className='flex justify-end gap-4 max-md:flex-col'>
                    <Button
                        type='button'
                        variant='outlined'
                        disabled={loading}
                        onClick={() => onUpdateDeviceIdClick()}
                        label={user?.device_id ? 'Update Device Id' : 'Add Device Id'}
                    />

                    <Button
                        type='button'
                        variant='outlined'
                        disabled={loading}
                        onClick={() => onUpdatePasswordClick()}
                        label='Update Password'
                    />

                    <Button type='submit' loading={loading} label='Save' />
                </div>
            </form>
        </div>
    )
}

export default Settings
