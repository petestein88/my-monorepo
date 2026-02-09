import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Button from '../common/Button'
import Input from '../common/Input'
import { LOCAL_STORAGE_ENUM } from '../enums/common.enum'
import { useAuthProviderContext } from '../providers/AuthProvider'
import { useModal } from '../providers/ModalProvider'
import { schemas } from '../schemas'
import { utils } from '../utils'
import { http } from '../utils/http'
import ModalWrapper from './ModalWrapper'

const DeviceModal = () => {
    const modalContext = useModal()
    const [status, setStatus] = useState<'set' | 'unset' | null>(null)

    const deviceModalData = modalContext.modals.device
    const { deviceId = '', slot = '' } = deviceModalData
    const { update } = useAuthProviderContext()

    const handleClose = () => {
        localStorage.setItem(LOCAL_STORAGE_ENUM.OPEN_ADD_SLOT_MODAL, 'false')
        modalContext.closeModal('device')
    }

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schemas.addUpdateDeviceSchema),
        defaultValues: {
            deviceId,
            slot
        }
    })

    useEffect(() => {
        reset({ deviceId, slot })
    }, [deviceId, slot, reset])

    const checkDataUpdated = () => {
        const updated =
            new Set([
                deviceModalData?.slot ?? '',
                watch().slot ?? '',
                deviceModalData?.deviceId ?? '',
                watch().deviceId ?? ''
            ]).size > 2
        return updated
    }

    const handleSubmitDeviceid = async (data: { deviceId: string; slot: string }) => {
        const formattedData = `${data.deviceId}-${data.slot}`

        try {
            setStatus('set')

            const response = await http({
                url: 'user/deviceid',
                method: 'PATCH',
                data: {
                    device_id: formattedData
                }
            })

            if (response.data) {
                update()
            }

            utils.toast.success({ message: 'Device Id added successfully' })
            handleClose()
        } catch (error: unknown) {
            utils.toast.error(utils.error.handler(error))
            setStatus(null)
        }
    }

    const handleRemoveDeviceId = async () => {
        try {
            setStatus('unset')

            const response = await http({
                url: 'user/deviceid',
                method: 'DELETE'
            })

            if (response.data) {
                update()
            }
            utils.toast.success({ message: 'Device Id removed successfully' })
            reset({ deviceId: '', slot: '' })
            handleClose()
        } catch (error: unknown) {
            utils.toast.error(utils.error.handler(error))
        } finally {
            setStatus(null)
        }
    }

    const isUpdateModal = !!deviceId

    return (
        <ModalWrapper
            preventCloseOnOutsideClick={deviceModalData.disableOutsideClick}
            handleClose={handleClose}
            heading={isUpdateModal ? 'Update or Remove Device' : 'Add Device'}
            footer={
                <div className='flex justify-end gap-2 mt-4'>
                    {isUpdateModal && (
                        <Button
                            onClick={handleSubmit(handleRemoveDeviceId)}
                            loading={status === 'unset'}
                            disabled={Boolean(status)}
                            sizeVariant='sm'
                            label='Reset'
                        />
                    )}
                    <Button
                        onClick={handleSubmit(handleSubmitDeviceid)}
                        loading={status === 'set'}
                        sizeVariant='sm'
                        disabled={checkDataUpdated() === false || Boolean(status)}
                        label={isUpdateModal ? 'Update' : 'Submit'}
                    />
                </div>
            }
        >
            <div className='flex flex-col space-y-4'>
                <form className='flex flex-col space-y-4' onSubmit={handleSubmit(handleSubmitDeviceid)}>
                    <Controller
                        name='deviceId'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type='text'
                                label='Device ID'
                                placeholder='Enter device (e.g., A)'
                                error={errors.deviceId?.message}
                            />
                        )}
                    />
                    <Controller
                        name='slot'
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type='text'
                                label='Slot'
                                placeholder='Enter slot'
                                error={errors.slot?.message}
                            />
                        )}
                    />
                </form>
            </div>
        </ModalWrapper>
    )
}

export default DeviceModal
