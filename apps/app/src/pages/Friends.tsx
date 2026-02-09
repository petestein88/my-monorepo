import { useEffect, useState } from 'react'
import { format, isAfter, subDays } from 'date-fns'
import { UserPlus } from 'lucide-react'
import { useModal } from '../providers/ModalProvider'
import InfiniteScroll from 'react-infinite-scroll-component'
import { http } from '../utils/http'
import { utils } from '../utils'
import { Friend } from '../types'
import Loader from '../common/Loader'
import Select from 'react-select'
import NoDataToShow from '../common/Placeholders/NoDataToShow'
import clsx from 'clsx'

import { useAuthProviderContext } from '../providers/AuthProvider'

interface SessionEntry {
    date: string
    total_charging_duration: string
    total_duration: any
}

interface SummaryEntry {
    total_charging_duration: any
    daily_average: number
}

interface SummaryData {
    me: SummaryEntry
    [key: string]: SummaryEntry
}
export default function Friends() {
    const { user } = useAuthProviderContext()
    const modalContext = useModal()
    const [loading, setLoading] = useState(true)
    const [friends, setFriends] = useState<Friend[]>([])
    const [_, setFriendsLoading] = useState(true)
    const [requests, setRequests] = useState<Friend[]>([])
    const [selectedFriends, setSelectedFriends] = useState<Friend[]>([])
    const [processingFriendIndex, setProcessingFriendIndex] = useState(-1)

    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [allFriendsData, setAllFriendsData] = useState<Friend[]>([])

    const [dateRange, setDateRange] = useState({
        from: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
        to: format(new Date(), 'yyyy-MM-dd')
    })

    const [leaderboardData, setLeaderboardData] = useState<{ [key: string]: SessionEntry[] }>({})
    const [summary, setSummary] = useState<SummaryData>({
        me: { total_charging_duration: '0', daily_average: 0 }
    })

    useEffect(() => {
        fetchFriendRequestData()
        fetchFriendsList()
    }, [])

    const fetchFriendRequestData = async () => {
        try {
            const response = await http({
                url: `friend/requests?page=${page}&limit=10`,
                method: 'GET'
            })

            const requestsData = response.data.data.friends
            if (Array.isArray(requestsData)) {
                setRequests(prev => (page === 1 ? requestsData : [...prev, ...requestsData]))
                if (requestsData.length === 0) {
                    setHasMore(false)
                } else {
                    setPage(prevPage => prevPage + 1)
                }
            }
        } catch (error) {
            console.error('Error fetching leaderboard data:', error)
            setHasMore(false)
        } finally {
            setLoading(false)
        }
    }

    const handleFriendChange = (selectedOptions: Friend[]) => {
        if (selectedOptions.length > 2) return
        setSelectedFriends(selectedOptions)
    }

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const queryString = selectedFriends.length
                    ? selectedFriends
                          .map(friend => `ids[]=${friend.user_id === user.id ? friend.friend_id : friend.user_id}`)
                          .join('&')
                    : ''

                const response = await http({
                    url: `/friend/with-scores?from=${dateRange.from}&to=${dateRange.to}&limit=3${queryString ? `&${queryString}` : ''}`,
                    method: 'GET'
                })

                console.log('Leaderboard response:', response)

                const apiData = response.data.data.friends
                setAllFriendsData(apiData)
                const newSummary: SummaryData = {
                    me: undefined
                }
                const newLeaderboardData: { [key: string]: number } = {}

                apiData.forEach(friend => {
                    newSummary[friend.id] = {
                        total_charging_duration: Number(friend.total_charging_duration) / 60, // Convert minutes to hours
                        daily_average: Number(friend.daily_average) / 60 // Convert minutes to hours
                    }

                    newLeaderboardData[friend.id] =
                        friend.groupedSessions.map(session => ({
                            date: format(new Date(session.session_date), 'yyyy-MM-dd'),
                            total_duration: Number(session.total_duration) / 60 // Convert to hours
                        })) || []
                })

                setSummary(newSummary)
                setLeaderboardData(newLeaderboardData as any)
            } catch (error) {
                utils.toast.error(utils.error.handler(error))
            }
        }

        fetchLeaderboardData()
    }, [selectedFriends, dateRange])

    const addFriend = async (friend: Friend, index: number) => {
        try {
            setProcessingFriendIndex(index)

            await http({
                url: `friend/${friend.id}`,
                method: 'PUT'
            })

            setRequests(prev => prev.filter(f => f.id !== friend.id))
            utils.toast.success({ message: 'Friend request accepted!' })
        } catch (error) {
            utils.toast.error({ message: 'Failed to accept friend request' })
            console.error('Error adding friend:', error)
        } finally {
            setProcessingFriendIndex(-1)
        }
    }

    const deleteRequestFriend = async (friend: Friend, index: number) => {
        try {
            setProcessingFriendIndex(index)

            await http({
                url: `friend/${friend.id}`,
                method: 'DELETE'
            })

            setRequests(prev => prev.filter(f => f.id !== friend.id))
            utils.toast.success({ message: 'Friend request deleted!' })
        } catch (error) {
            utils.toast.error({ message: 'Failed to delete friend request' })
            console.error('Error deleting friend request:', error)
        } finally {
            setProcessingFriendIndex(-1)
        }
    }
    const fetchFriendsList = async () => {
        try {
            setFriendsLoading(true)

            const response = await http({
                url: 'friend/friends',
                method: 'GET'
            })

            const friendsData = response.data.data.friends

            if (Array.isArray(friendsData)) {
                setFriends(friendsData)
            }
        } catch (error) {
            utils.toast.error(utils.error.handler(error))
        } finally {
            setFriendsLoading(false)
        }
    }

    const handleDateChange = (type: 'from' | 'to', value: string) => {
        const newDate = new Date(value)
        const fromDate = new Date(dateRange.from)

        if (type === 'from' && isAfter(newDate, new Date())) return
        if (type === 'to' && isAfter(newDate, new Date())) return
        if (type === 'to' && isAfter(newDate, subDays(fromDate, -30))) return

        setDateRange(prev => ({ ...prev, [type]: value }))
    }

    const handleUserSelect = (user: any) => {
        console.log('Selected User:', user)
    }

    const openSearchModal = () => {
        modalContext.openModal({
            type: 'search',
            props: {
                visible: true,
                onSelectUser: handleUserSelect
            }
        })
    }

    const friendOptions = friends.map(friend => ({
        ...friend,
        value: friend.id,
        label: utils.helpers.user.getFullName(friend)
    }))

    return (
        <div className='space-y-8'>
            {/* Leaderboard */}
            <div className='bg-white shadow rounded-lg p-6 space-y-4'>
                <div className='flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 w-full'>
                    {/* Left Section */}
                    <div className='flex flex-col sm:flex-row sm:items-center gap-3 w-full'>
                        <h3 className='text-lg font-medium text-gray-900'>Leaderboard</h3>
                        <Select<Friend, true>
                            isMulti
                            options={friendOptions}
                            getOptionLabel={friend => utils.helpers.user.getFullName(friend)}
                            getOptionValue={friend => String(friend.id)}
                            value={selectedFriends}
                            onChange={handleFriendChange}
                            placeholder='Choose friends (Max 2)'
                            closeMenuOnSelect={false}
                            styles={{
                                control: (styles, state) => ({
                                    ...styles,
                                    width: '100%',
                                    maxWidth: '350px',
                                    minHeight: '10px',
                                    border: `1px solid ${state.isFocused ? '#4f46e5' : '#6b7280'}`,
                                    boxShadow: state.isFocused ? '0 0 0 1px #4f46e5' : 'none',
                                    '&:hover': {
                                        border: '1px solid #4f46e5'
                                    }
                                }),
                                menu: styles => ({
                                    ...styles,
                                    backgroundColor: '#ffffff',
                                    color: '#111827'
                                }),
                                option: (styles, { isFocused, isSelected }) => ({
                                    ...styles,
                                    backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#f3f4f6' : 'transparent',
                                    color: isSelected ? '#ffffff' : '#111827',
                                    '&:active': {
                                        backgroundColor: '#4f46e5',
                                        color: '#ffffff'
                                    }
                                }),
                                placeholder: styles => ({
                                    ...styles,
                                    color: '#6b7280'
                                }),
                                singleValue: styles => ({
                                    ...styles,
                                    color: '#111827'
                                }),
                                multiValue: styles => ({
                                    ...styles,
                                    backgroundColor: '#4f46e5',
                                    color: '#ffffff'
                                }),
                                multiValueLabel: styles => ({
                                    ...styles,
                                    color: '#ffffff'
                                }),
                                multiValueRemove: styles => ({
                                    ...styles,
                                    color: '#ffffff',
                                    ':hover': {
                                        backgroundColor: '#4338ca',
                                        color: '#ffffff'
                                    }
                                })
                            }}
                        />
                    </div>

                    {/* Right Section (Date Inputs) */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto'>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
                            <label htmlFor='date-from' className='text-sm font-medium text-gray-700'>
                                From:
                            </label>
                            <input
                                type='date'
                                id='date-from'
                                value={dateRange.from}
                                onChange={e => handleDateChange('from', e.target.value)}
                                className='block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                            />
                        </div>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
                            <label htmlFor='date-to' className='text-sm font-medium text-gray-700'>
                                To:
                            </label>
                            <input
                                type='date'
                                id='date-to'
                                value={dateRange.to}
                                onChange={e => handleDateChange('to', e.target.value)}
                                className='block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                            />
                        </div>
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead>
                            <tr>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Date
                                </th>
                                {allFriendsData.map(friend => (
                                    <th
                                        key={friend.id}
                                        className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        <div>{friend.id === user.id ? 'Me' : friend.first_name}</div>
                                        <div className='text-xs font-normal mt-1'>
                                            Total: {summary[friend.id]?.total_charging_duration ?? '0'}h | Avg:{' '}
                                            {summary[friend.id]?.daily_average ?? 0}h/day
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {Array.from(
                                {
                                    length:
                                        Math.ceil(
                                            (new Date(dateRange.to).getTime() - new Date(dateRange.from).getTime()) /
                                                (1000 * 60 * 60 * 24)
                                        ) + 1
                                },
                                (_, i) => {
                                    const date = format(subDays(new Date(dateRange.to), i), 'yyyy-MM-dd')

                                    return (
                                        <tr key={date}>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                                {format(new Date(date), 'MMMM d, yyyy')}
                                            </td>
                                            {allFriendsData.map(friend => {
                                                const session = leaderboardData[friend.id]?.find(s => s.date === date)
                                                return (
                                                    <td key={friend.id} className='px-6 py-4 text-sm text-gray-500'>
                                                        {session ? session.total_duration.toFixed(2) : '0'} hours
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                }
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Leaderboard */}

            {/* Friend Requests */}
            <div className='bg-white shadow rounded-lg p-6 space-y-4'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-lg font-medium text-dark transition-colors'>Friend Requests</h2>
                    <button
                        onClick={openSearchModal}
                        className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2'
                    >
                        <UserPlus className='h-4 w-4 mr-2' />
                        Add Friend
                    </button>
                </div>
                <div className='max-h-[300px] overflow-y-auto space-y-2' id='leaderboardContainer'>
                    {loading ? (
                        <div className='flex justify-center items-center min-h-[100px] md:min-h-[150px]'>
                            <Loader size='lg' />
                        </div>
                    ) : !requests.length ? (
                        <NoDataToShow text='No friend requests at the moment.' />
                    ) : (
                        <InfiniteScroll
                            dataLength={requests?.length}
                            next={fetchFriendRequestData}
                            hasMore={hasMore}
                            scrollableTarget='leaderboardContainer'
                            scrollThreshold={'80%'}
                            loader={
                                requests?.length ? (
                                    <h4
                                        style={{
                                            textAlign: 'center',
                                            padding: '10px'
                                        }}
                                    >
                                        Loading......
                                    </h4>
                                ) : null
                            }
                            className='flex flex-col justify-between w-full space-y-3'
                            endMessage={<NoDataToShow center={true} text='No more items to load.' />}
                        >
                            {requests.map((friend, index) => {
                                return (
                                    <li
                                        key={friend.id}
                                        className={clsx(
                                            'flex justify-between items-center cursor-pointer bg-white hover:bg-gray-100 transition-all duration-200',
                                            processingFriendIndex === index && 'pointer-events-none'
                                        )}
                                    >
                                        <div>
                                            <p className='font-medium flex items-center gap-2 text-secondary'>
                                                {utils.helpers.user.getFullName(friend)}{' '}
                                                {friend.phone_number && `(${friend.phone_number})`}
                                            </p>
                                            <p className='text-sm text-gray-500 flex items-center gap-2'>
                                                {friend.email || friend.phone_number}
                                            </p>
                                        </div>
                                        <div className='flex pr-3 gap-5 text-[22px]'>
                                            {processingFriendIndex === index ? (
                                                <Loader size='sm' />
                                            ) : (
                                                <>
                                                    <i
                                                        className='tabler-user-check text-green-500'
                                                        onClick={() => addFriend(friend, index)}
                                                    />
                                                    <i
                                                        className='tabler-user-x text-red-500'
                                                        onClick={() => deleteRequestFriend(friend, index)}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </li>
                                )
                            })}
                        </InfiniteScroll>
                    )}
                </div>
            </div>
            {/* Friend Requests */}
        </div>
    )
}
