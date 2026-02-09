import { Clock, Gift, Globe, Heart, PlusCircle, Swords, Target, Trophy, Users, UsersRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Link } from 'react-router-dom'
import Loader from '../common/Loader'
import NoDataToShow from '../common/Placeholders/NoDataToShow'
import { useAuthProviderContext } from '../providers/AuthProvider'
import { useModal } from '../providers/ModalProvider'
import { utils } from '../utils'
import { dateTime } from '../utils/date'
import { http } from '../utils/http'

type IFriend = {
    isMe: boolean
    name: string
    totalHours: number
    totalDays: number
}

export const challengeTypes = [
    {
        type: 'Head to Head',
        icon: Swords,
        description: 'Set up a challenge against one other person, for a time frame of your choosing'
    },
    {
        type: 'Me vs Myself',
        icon: Target,
        description: 'Set a goal for yourself over a chosen time period and challenge yourself'
    },
    {
        type: 'Group Battle',
        icon: Users,
        description: 'Compete individually against a group of friends, family or classmates over a chosen time period'
    },
    {
        type: 'Team vs Team',
        icon: UsersRound,
        description:
            'Form a team and challenge another team of similar size eg neighbour vs neighbour or school class vs school class'
    },
    {
        type: 'Global Battle',
        icon: Globe,
        description: 'Take on the world in our weekly and monthly global challenges, you vs everyone'
    }
]

export default function Home() {
    const { user } = useAuthProviderContext()
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [leaderboard, setLeaderboard] = useState<IFriend[]>([])
    const [stats, setStats] = useState<{ label: string; value: string; icon: any }[]>([])
    const [loading, setLoading] = useState(true)

    const modalContext = useModal()

    const fetchDashboardData = async () => {
        try {
            const response = await http({
                url: `user/dashboard?page=${page}&limit=5`,
                method: 'GET'
            })

            if (response.data.status) {
                const {
                    daily_average,
                    total_hours_saved,
                    streak_days,
                    leaderboard: newLeaderboard,
                    totalHoursGlobalImpact: total_hours_global_impact
                } = response.data.data
                const dailyAverage = dateTime.formatTime(daily_average)
                const totalHoursSaved = dateTime.formatHours(parseFloat(total_hours_saved))
                const totalHoursGlobalImpact = dateTime.formatGlobalHours(parseFloat(total_hours_global_impact))

                setStats([
                    { label: 'Current Streak', value: `${streak_days} days`, icon: Trophy },
                    { label: 'Daily Average', value: dailyAverage, icon: Clock },
                    { label: 'Total Hours Saved', value: totalHoursSaved, icon: Clock },
                    { label: 'Global Impact', value: `${totalHoursGlobalImpact} hours`, icon: Target } // Static
                ])

                const processedData = newLeaderboard
                    .map((currentFriend: any) => {
                        if (!currentFriend) return null

                        const chargingDuration = parseInt(currentFriend.total_charging_duration || '0')

                        return {
                            isMe: currentFriend.id === user.id,
                            totalHours: parseFloat((chargingDuration / 60).toFixed(2)),
                            name: utils.helpers.user.getFullName(currentFriend),
                            totalDays: parseFloat((chargingDuration / 1440).toFixed(1))
                        } as IFriend
                    })
                    .filter(Boolean)

                setLeaderboard(processedData)
            } else {
                console.error('Error fetching dashboard data:', response)
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchLeaderboardData = async () => {
        try {
            const response = await http({
                url: `user/leaderboard?page=${page}&limit=10`,
                method: 'GET'
            })

            if (response.data.status) {
                const { leaderboard: newLeaderboard } = response.data.data

                const processedData = newLeaderboard
                    .map((currentFriend: any) => {
                        if (!currentFriend) return null

                        const chargingDuration = parseInt(currentFriend.total_charging_duration || '0')

                        return {
                            isMe: currentFriend.id === user.id,
                            totalHours: parseFloat((chargingDuration / 60).toFixed(2)),
                            name: utils.helpers.user.getFullName(currentFriend),
                            totalDays: parseFloat((chargingDuration / 1440).toFixed(1))
                        } as IFriend
                    })
                    .filter(Boolean)

                setLeaderboard(prev => (page === 1 ? processedData : [...prev, ...processedData]))
                if (processedData.length === 0) {
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

    useEffect(() => {
        fetchDashboardData()
        fetchLeaderboardData()
    }, [])

    const onGettingStartedClick = () => {
        modalContext.openModal({
            type: 'info',
            props: {
                html: null,
                heading: 'Getting Started',
                cancelButtonText: 'Close',
                onOkClick: () => {
                    modalContext.closeModal('info')
                },
                visible: true
            }
        })
    }

    const challenges = [
        { label: 'Create a Challenge', icon: PlusCircle },
        { label: 'Prizes', icon: Gift },
        { label: 'Join a Challenge', icon: Users, href: '/challenges' }
    ]

    const activeChallenges = [
        {
            type: 'Head to Head',
            name: '7-Day Phone-Free Evenings',
            participants: 'You vs. James',
            progress: '5/7 days',
            endDate: '2024-03-15',
            icon: Swords,
            status: 'Winning'
        },
        {
            type: 'Me vs Myself',
            name: 'Morning Routine Builder',
            participants: 'Personal Goal',
            progress: '8/14 days',
            endDate: '2024-03-21',
            icon: Target,
            status: 'On Track'
        },
        {
            type: 'Group Battle',
            name: 'March Mindfulness',
            participants: '8 participants',
            progress: '45/100 hours',
            endDate: '2024-03-31',
            icon: Users,
            status: '3rd Place'
        },
        {
            type: 'Team vs Team',
            name: 'Digital Detox Teams',
            participants: 'Team Wellness (5) vs Team Focus (5)',
            progress: '234/500 hours',
            endDate: '2024-03-30',
            icon: UsersRound,
            status: 'Leading by 23 hours'
        },
        {
            type: 'Global Battle',
            name: 'March Global Challenge',
            participants: 'You vs Everyone',
            progress: '15/31 days',
            endDate: '2024-03-31',
            icon: Globe,
            status: 'Top 10%'
        }
    ]

    return (
        <div className='space-y-6'>
            {/* Welcome Message and Challenge Types */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='bg-white shadow rounded-lg p-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-4'>Welcome to Manumission</h2>
                    <div className='space-y-8'>
                        <p className='text-gray-700 leading-relaxed'>
                            Welcome to the Manumission platform, and welcome to the community. We hope that by joining
                            this platform of like-minded people from around the world, you will improve your smartphone
                            habits, become better at exercising your will power, spend more time on hobbies new and old,
                            spend more time being present with your friends, family, pets & plants, and ultimately
                            reconnect with yourself <Heart className='inline h-4 w-4 text-red-500' />. With this
                            platform, you can challenge yourself, other individuals, create team v team challenges or
                            join a global challenge against everyone.
                        </p>
                        <div className='flex justify-end'>
                            <button
                                onClick={onGettingStartedClick}
                                className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primaryDark transition-colors'
                            >
                                Getting Started
                            </button>
                        </div>
                    </div>
                </div>

                <div className='bg-white shadow rounded-lg p-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-4'>Create Your First Challenge</h2>
                    <div className='space-y-4'>
                        {challengeTypes.map(challenge => {
                            const Icon = challenge.icon
                            return (
                                <div key={challenge.type} className='flex items-start space-x-4'>
                                    <div className='flex items-center bg-indigo-50 px-3 py-2 rounded-md min-w-[140px]'>
                                        <Icon className='h-5 w-5 text-primary mr-2' />
                                        <span className='text-sm font-medium text-gray-900'>{challenge.type}</span>
                                    </div>
                                    <p className='text-sm text-gray-600 flex-1'>{challenge.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-4'>
                {loading ? (
                    <div className='col-span-full flex justify-center items-center max-md:min-h-[400px] md:min-h-[95px]'>
                        <Loader size='md' />
                    </div>
                ) : (
                    stats.map(stat => {
                        const Icon = stat.icon
                        return (
                            <div key={stat.label} className='bg-white overflow-hidden shadow rounded-lg'>
                                <div className='px-4 py-5 sm:p-6'>
                                    <div className='flex items-center'>
                                        <div className='flex-shrink-0'>
                                            <Icon className='h-6 w-6 text-primary' />
                                        </div>
                                        <div className='ml-5 w-0 flex-1'>
                                            <dl>
                                                <dt className='text-sm font-medium text-gray-500 truncate'>
                                                    {stat.label}
                                                </dt>
                                                <dd className='text-lg font-semibold text-gray-900'>{stat.value}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                {challenges.map(challenge => {
                    const Icon = challenge.icon
                    const Component = challenge.href ? Link : 'div'
                    return (
                        <Component
                            key={challenge.label}
                            to='{challenge.href}'
                            className='bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'
                        >
                            <div className='px-4 py-5 sm:p-6'>
                                <div className='flex items-center justify-center'>
                                    <Icon className='h-6 w-6 text-primary mr-2' />
                                    <span className='text-lg font-medium text-gray-900'>{challenge.label}</span>
                                </div>
                            </div>
                        </Component>
                    )
                })}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='bg-white shadow rounded-lg overflow-hidden'>
                    <div className='px-4 py-5 sm:p-6'>
                        <Link
                            to={utils.helpers.getRoute('/friends')}
                            className='text-lg font-medium text-gray-900 mb-4 hover:text-primary transition-colors block'
                        >
                            Leaderboard
                        </Link>
                        {leaderboard.length === 1 ? (
                            <NoDataToShow text='Add some friends and compete with them on the leaderboard.' />
                        ) : (
                            <div className='overflow-x-auto mt-4'>
                                <table className='min-w-full border-collapse'>
                                    <thead>
                                        <tr>
                                            <th className='px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase w-2/4'>
                                                Name
                                            </th>
                                            <th className=' py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase w-1/4'>
                                                Hours
                                            </th>
                                            <th className=' py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase w-1/4'>
                                                Days
                                            </th>
                                        </tr>
                                    </thead>
                                    {loading ? (
                                        <tbody>
                                            <tr>
                                                <td colSpan={3} className='py-10'>
                                                    <div className='flex justify-center items-center'>
                                                        <Loader size='md' />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    ) : (
                                        <tbody className='divide-y divide-gray-100'>
                                            <tr>
                                                <td colSpan={3}>
                                                    <div
                                                        className='max-h-[180px] overflow-y-auto h-full'
                                                        id='leaderboardContainer'
                                                    >
                                                        <InfiniteScroll
                                                            dataLength={leaderboard.length}
                                                            next={() => {
                                                                fetchLeaderboardData()
                                                            }}
                                                            hasMore={hasMore}
                                                            scrollableTarget='leaderboardContainer'
                                                            scrollThreshold={'80%'}
                                                            loader={
                                                                <h4
                                                                    style={{
                                                                        textAlign: 'center',
                                                                        padding: '10px'
                                                                    }}
                                                                >
                                                                    Loading...
                                                                </h4>
                                                            }
                                                            className='flex flex-col justify-between w-full'
                                                            endMessage={
                                                                <NoDataToShow
                                                                    center={true}
                                                                    text={'No more items to load.'}
                                                                />
                                                            }
                                                        >
                                                            {leaderboard.map(leaderboard => (
                                                                <table key={leaderboard.name}>
                                                                    <tbody>
                                                                        <tr className='hover:bg-gray-50'>
                                                                            <td className='px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 w-2/4'>
                                                                                {leaderboard.name}
                                                                            </td>
                                                                            <td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500 w-1/4'>
                                                                                {leaderboard.totalHours}
                                                                            </td>
                                                                            <td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500 w-1/4'>
                                                                                {leaderboard.totalDays}
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            ))}
                                                        </InfiniteScroll>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className='bg-white shadow rounded-lg overflow-hidden'>
                    <div className='px-4 py-5 sm:p-6'>
                        <h3 className='text-lg font-medium text-gray-900 mb-4'>Active Challenges</h3>
                        <div className='overflow-x-auto'>
                            <table className='min-w-full divide-y divide-gray-200'>
                                <thead>
                                    <tr>
                                        <th className='px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase'>
                                            Type
                                        </th>
                                        <th className='px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase'>
                                            Challenge
                                        </th>
                                        <th className='px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase'>
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                    {activeChallenges.map(challenge => {
                                        const Icon = challenge.icon
                                        return (
                                            <tr key={challenge.name} className='hover:bg-gray-50'>
                                                <td className='px-3 py-2 whitespace-nowrap'>
                                                    <div className='flex items-center'>
                                                        <Icon className='h-4 w-4 text-primary mr-2' />
                                                        <span className='text-sm font-medium text-gray-900'>
                                                            {challenge.type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='px-3 py-2 whitespace-nowrap text-sm text-gray-900'>
                                                    {challenge.name}
                                                </td>
                                                <td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500'>
                                                    {challenge.status}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
