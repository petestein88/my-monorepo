import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import ModalWrapper from './ModalWrapper'
import { http } from '../utils/http'
import Input from '../common/Input'
import { useModal } from '../providers/ModalProvider'
import { utils } from '../utils'
import { schemas } from '../schemas'
import { useAuthProviderContext } from '../providers/AuthProvider'
import Loader from '../common/Loader'
import { helpers } from '../utils/helpers'
import clsx from 'clsx'
import { Friend } from '../types'

type FormData = (typeof schemas.searchInputSchema)['__outputType']

const UserSearchModal = () => {
    const { user } = useAuthProviderContext()
    const { modals, closeModal } = useModal()
    const [processingFriendId, setProcessingFriendID] = useState(-1)

    const searchModalData = modals.search

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(schemas.searchInputSchema),
        defaultValues: { search: '' },
        mode: 'onSubmit'
    })

    const [loading, setLoading] = useState(false)
    const [friends, setFriends] = useState<Friend[]>([])
    const [searchTriggered, setSearchTriggered] = useState(false)
    const [selectedFriends, setSelectedFriends] = useState<Record<number, Friend>>({})

    const handleSearch = async (data: { search: string }) => {
        if (!data.search.trim()) {
            setFriends([])
            return
        }

        setLoading(true)
        setSearchTriggered(true)

        try {
            const response = await http({
                url: `friend/search?query=${data.search}`,
                method: 'GET'
            })

            const friends = response.data.data.users

            setFriends(
                friends.map((currentUser: Friend) => {
                    return {
                        ...currentUser,
                        icon: helpers.friend.getFriendshipStatus(currentUser, user.id)
                    } as Friend
                })
            )
        } catch (err) {
            console.error('Error fetching friends:', err)
        } finally {
            setLoading(false)
        }
    }

    const debouncedSearch = useRef(utils.debounce(handleSubmit(handleSearch), 500))

    useEffect(() => {
        const searchValue = watch('search')
        if (searchValue.trim()) {
            debouncedSearch.current(searchValue)
        } else {
            setFriends([])
        }
    }, [watch('search')])

    const addFriend = async (friend: Friend, send = true) => {
        try {
            setProcessingFriendID(friend.user_id === user.id ? friend.friend_id : friend.user_id)

            const response = await http({
                url: `friend/${send ? friend.id : friend.friendship_id}`,
                method: send ? 'POST' : 'PUT'
            })

            const { message, data } = response.data

            const addedFriend = data?.friend

            if (friend) {
                const { id: _, ...restAddedFriend } = addedFriend

                let keysToUpdate: Partial<Friend> = {
                    status: '1',
                    friendship_id: addedFriend.id,
                    ...restAddedFriend
                }

                keysToUpdate = {
                    ...keysToUpdate,
                    icon: utils.helpers.friend.getFriendshipStatus(keysToUpdate as Friend, user.id)
                }

                setSelectedFriends(prev => ({
                    ...prev,
                    [friend.id]: {
                        ...friend,
                        ...keysToUpdate
                    }
                }))

                setFriends(previousFriends => {
                    return previousFriends.map(c => {
                        if (c.id !== friend.id) {
                            return c
                        }

                        return {
                            ...c,
                            ...keysToUpdate
                        }
                    }) as Friend[]
                })
            }

            utils.toast.success({ message })
        } catch (error) {
            utils.toast.error(utils.error.handler(error))
            console.error('Error sending friend request:', error)
        } finally {
            setProcessingFriendID(-1)
        }
    }

    const deleteRequestFriend = async (friend: Friend) => {
        try {
            const friendUserId = friend.user_id === user.id ? friend.friend_id : friend.user_id
            setProcessingFriendID(friendUserId)

            const response = await http({
                url: `friend/${friend.friendship_id}`,
                method: 'DELETE'
            })

            const { message } = response.data

            setSelectedFriends(prev => {
                const updated = { ...prev }
                delete updated[friendUserId]
                return updated
            })

            setFriends(previousFriends => {
                let update = false
                let updatedFriend: Friend | null = null
                return previousFriends.map(currentPreviousfriend => {
                    update = currentPreviousfriend.id === friendUserId

                    if (!update) {
                        return currentPreviousfriend
                    }

                    updatedFriend = {
                        ...currentPreviousfriend,
                        friendship_id: null,
                        status: null,
                        friend_id: null,
                        user_id: null
                    }

                    return {
                        ...updatedFriend,
                        icon: utils.helpers.friend.getFriendshipStatus(updatedFriend, user.id)
                    }
                })
            })

            utils.toast.success({ message })
        } catch (error) {
            utils.toast.error(utils.error.handler(error))
            console.error('Error deleting friend request:', error)
        } finally {
            setProcessingFriendID(-1)
        }
    }

    const handleClose = () => {
        closeModal('search')
    }

    const getFriendStatusIcon = (friend: Friend) => {
        return (
            <div className='text-[22px] cursor-pointer flex items-center gap-2'>
                {[friend.friend_id, friend.user_id].includes(processingFriendId) ? (
                    <Loader size='sm' />
                ) : (
                    <>
                        {friend.icon === 'accept' && (
                            <>
                                <i className='tabler-user-x text-red-500' onClick={() => deleteRequestFriend(friend)} />
                                <i
                                    className='tabler-user-check text-green-500'
                                    onClick={() => addFriend(friend, false)}
                                />
                            </>
                        )}
                        {friend.icon === 'add' && (
                            <i className='tabler-user-plus text-blue-500' onClick={() => addFriend(friend)} />
                        )}
                        {friend.icon === 'pending' && (
                            <i className='tabler-user-x text-red-500' onClick={() => deleteRequestFriend(friend)} />
                        )}
                        {friend.icon === 'added' && (
                            <>
                                <i className='tabler-xbox-x text-red-500' onClick={() => deleteRequestFriend(friend)} />
                            </>
                        )}
                    </>
                )}
            </div>
        )
    }

    return (
        searchModalData && (
            <ModalWrapper heading='Search User' handleClose={handleClose} preventCloseOnOutsideClick={false}>
                <div className='max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'>
                    <form className='flex flex-col space-y-4' onSubmit={handleSubmit(handleSearch)}>
                        <Controller
                            name='search'
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type='text'
                                    placeholder='Enter email or phone number'
                                    error={errors.search?.message}
                                />
                            )}
                        />
                    </form>

                    {loading ? (
                        <div className='flex justify-center items-end h-[80px]'>
                            <Loader size='sm' />
                        </div>
                    ) : friends.length === 0 ? (
                        searchTriggered ? (
                            <p className='text-center text-gray-500 mt-2'>No users found</p>
                        ) : null
                    ) : (
                        <>
                            <h2 className='text-md font-semibold mt-4 mb-2 text-secondary'>Search Results</h2>
                            <ul
                                className={clsx(
                                    'mt-2 space-y-2',
                                    Object.keys(selectedFriends).length && 'border-b pb-4'
                                )}
                            >
                                {friends.map(friend => {
                                    return (
                                        <li
                                            key={friend.id}
                                            className='p-3 border rounded-lg flex justify-between items-center cursor-pointer bg-white hover:bg-gray-100 transition-all duration-200'
                                        >
                                            <div>
                                                <p className='font-medium flex items-center gap-2 text-secondary'>
                                                    {utils.helpers.user.getFullName(friend)}
                                                </p>
                                                <p className='text-sm text-gray-500 flex items-center gap-2'>
                                                    {friend.email || friend.phone_number}
                                                </p>
                                            </div>
                                            {getFriendStatusIcon(friend)}
                                        </li>
                                    )
                                })}
                            </ul>
                        </>
                    )}

                    {Object.keys(selectedFriends).length > 0 && (
                        <div className='mt-4'>
                            <h3 className='text-md font-semibold mb-2 text-secondary'>Friend Requests</h3>
                            <ul className='space-y-2'>
                                {Object.values(selectedFriends).map(friend => (
                                    <li
                                        key={friend.id}
                                        className='flex justify-between items-center p-2 border rounded-lg'
                                    >
                                        <div>
                                            <p className='font-medium flex items-center gap-2 text-secondary'>
                                                {utils.helpers.user.getFullName(friend)}
                                            </p>
                                            <p className='text-sm text-gray-500 flex items-center gap-2'>
                                                {friend.email || friend.phone_number}
                                            </p>
                                        </div>
                                        {getFriendStatusIcon(friend)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </ModalWrapper>
        )
    )
}

export default UserSearchModal
