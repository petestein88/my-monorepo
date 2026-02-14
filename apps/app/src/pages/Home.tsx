import { Clock, Gift, Globe, Heart, PlusCircle, Swords, Target, Trophy, Users, UsersRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../common/Loader'
import NoDataToShow from '../common/Placeholders/NoDataToShow'
import { useAuthProviderContext } from '../providers/AuthProvider'
import { useModal } from '../providers/ModalProvider'
import { supabase } from '../config/supabase'
import { utils } from '../utils'

type LeaderboardMode = 'all_time' | 'this_week'

type GlobalLeaderboardRow = {
    user_id: string
    email: string | null
    display_name: string | null
    total_hours: number | string | null
    total_seconds: number | string | null
}

type ILeaderboardRow = {
    userId: string
    isMe: boolean
    name: string
    email: string
    totalHours: number
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
    const modalContext = useModal()

    const [stats, setStats] = useState<{ label: string; value: string; icon: any }[]>([])

    const [leaderboardMode, setLeaderboardMode] = useState<LeaderboardMode>('all_time')
    const [leaderboardLoading, setLeaderboardLoading] = useState(true)
    const [leaderboardRows, setLeaderboardRows] = useState<ILeaderboardRow[]>([])
    const [weekWindowLabel, setWeekWindowLabel] = useState<string>('')

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

    const leaderboardHeader = useMemo(() => {
        return leaderboardMode === 'this_week'
            ? `This week (Mon 12pm → Mon 12pm)${weekWindowLabel ? ` · ${weekWindowLabel}` : ''}`
            : 'All time'
    }, [leaderboardMode, weekWindowLabel])

    const loadStats = async () => {
        if (!user?.id) return

        try {
            const { data, error } = await supabase
                .from('public_user_stats')
                .select('total_seconds')
                .eq('user_id', user.id)
                .maybeSingle()

            if (error) throw error

            const totalSeconds = Number(data?.total_seconds ?? 0)
            const totalHours = (totalSeconds / 3600).toFixed(2)

            // Minimal, non-blocking stats for MVP (we can improve later)
            setStats([
                { label: 'Current Streak', value: '—', icon: Trophy },
                { label: 'Daily Average', value: '—', icon: Clock },
                { label: 'Total Hours Saved', value: `${totalHours} hours`, icon: Clock },
                { label: 'Logged in as', value: user.email ?? '', icon: Users }
            ])
        } catch (error: any) {
            console.error('Home.loadStats error', error)
            // Don’t fail the page if stats fail
            setStats([
                { label: 'Current Streak', value: '—', icon: Trophy },
                { label: 'Daily Average', value: '—', icon: Clock },
                { label: 'Total Hours Saved', value: '—', icon: Clock },
                { label: 'Logged in as', value: user.email ?? '', icon: Users }
            ])
        }
    }

    const mapRows = (rows: GlobalLeaderboardRow[]): ILeaderboardRow[] => {
        return (rows ?? []).map(r => {
            const email = String(r.email ?? '')
            const displayName = String(r.display_name ?? '').trim()
            const name = displayName || email.split('@')[0] || 'User'

            return {
                userId: r.user_id,
                isMe: r.user_id === user.id,
                name,
                email,
                totalHours: Number(r.total_hours ?? 0)
            }
        })
    }

    const loadLeaderboardAllTime = async () => {
        const { data, error } = await supabase
            .from('global_leaderboard_all_time')
            .select('user_id,email,display_name,total_hours,total_seconds')
            .order('total_seconds', { ascending: false })
            .limit(100)

        if (error) throw error

        setLeaderboardRows(mapRows((data ?? []) as any))
        setWeekWindowLabel('')
    }

    const loadLeaderboardThisWeek = async () => {
        const { data: bounds, error: boundsError } = await supabase.rpc('current_week_bounds_monday_noon', {
            tz: 'Australia/Sydney'
        })

        if (boundsError) throw boundsError

        const from_ts = bounds?.[0]?.from_ts
        const to_ts = bounds?.[0]?.to_ts

        if (!from_ts || !to_ts) {
            throw new Error('Failed to determine current week range')
        }

        setWeekWindowLabel(`${String(from_ts).slice(0, 10)} → ${String(to_ts).slice(0, 10)}`)

        const { data, error } = await supabase.rpc('global_leaderboard_range', {
            from_ts,
            to_ts
        })

        if (error) throw error

        setLeaderboardRows(mapRows((data ?? []) as any))
    }

    const loadLeaderboard = async () => {
        setLeaderboardLoading(true)
        try {
            if (leaderboardMode === 'this_week') {
                await loadLeaderboardThisWeek()
            } else {
                await loadLeaderboardAllTime()
            }
        } catch (error: any) {
            console.error('Home.loadLeaderboard error', error)
            utils.toast.error({ message: error?.message ?? 'Failed to load leaderboard' })
            setLeaderboardRows([])
        } finally {
            setLeaderboardLoading(false)
        }
    }

    useEffect(() => {
        loadStats()
        loadLeaderboard()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        loadLeaderboard()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leaderboardMode])

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
                {stats.length === 0 ? (
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
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                            <div>
                                <h3 className='text-lg font-medium text-gray-900'>Global Leaderboard</h3>
                                <div className='text-xs text-gray-500 mt-1'>{leaderboardHeader}</div>
                            </div>

                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => setLeaderboardMode('all_time')}
                                    className={
                                        leaderboardMode === 'all_time'
                                            ? 'px-3 py-2 rounded-md bg-primary text-white text-sm'
                                            : 'px-3 py-2 rounded-md bg-gray-100 text-gray-900 text-sm hover:bg-gray-200'
                                    }
                                >
                                    All time
                                </button>
                                <button
                                    onClick={() => setLeaderboardMode('this_week')}
                                    className={
                                        leaderboardMode === 'this_week'
                                            ? 'px-3 py-2 rounded-md bg-primary text-white text-sm'
                                            : 'px-3 py-2 rounded-md bg-gray-100 text-gray-900 text-sm hover:bg-gray-200'
                                    }
                                >
                                    This week
                                </button>
                            </div>
                        </div>

                        <div className='overflow-x-auto mt-4'>
                            {leaderboardLoading ? (
                                <div className='flex justify-center items-center min-h-[120px]'>
                                    <Loader size='md' />
                                </div>
                            ) : !leaderboardRows.length ? (
                                <NoDataToShow text='No leaderboard data yet.' />
                            ) : (
                                <table className='min-w-full divide-y divide-gray-200'>
                                    <thead>
                                        <tr>
                                            <th className='px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase w-2/4'>
                                                Name
                                            </th>
                                            <th className='px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase w-2/4'>
                                                Email
                                            </th>
                                            <th className='px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase w-1/4'>
                                                Total Hours
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-200'>
                                        {leaderboardRows.map(row => (
                                            <tr
                                                key={row.userId}
                                                className={row.isMe ? 'bg-indigo-50' : 'hover:bg-gray-50'}
                                            >
                                                <td className='px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900'>
                                                    {row.isMe ? `Me (${row.name})` : row.name}
                                                </td>
                                                <td className='px-3 py-2 whitespace-nowrap text-sm text-gray-600'>
                                                    {row.email}
                                                </td>
                                                <td className='px-3 py-2 whitespace-nowrap text-sm text-gray-600'>
                                                    {row.totalHours.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className='mt-4'>
                            <Link
                                to={utils.helpers.getRoute('/friends')}
                                className='text-sm text-primary hover:text-primaryDark transition-colors'
                            >
                                Friends leaderboard
                            </Link>
                        </div>
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
