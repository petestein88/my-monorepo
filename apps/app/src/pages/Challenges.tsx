import { PlusCircle, Users, Swords, UsersRound, Target, Gift } from 'lucide-react'

export default function Challenges() {
    const challenges = [
        { label: 'Create a Challenge', icon: PlusCircle },
        { label: 'Prizes', icon: Gift },
        { label: 'Join a Challenge', icon: Users }
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
            type: 'Me vs Myself',
            name: 'Morning Routine Builder',
            participants: 'Personal Goal',
            progress: '8/14 days',
            endDate: '2024-03-21',
            icon: Target,
            status: 'On Track'
        }
    ]

    return (
        <div className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                {challenges.map(challenge => {
                    const Icon = challenge.icon
                    return (
                        <div
                            key={challenge.label}
                            className='bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'
                        >
                            <div className='px-4 py-5 sm:p-6'>
                                <div className='flex items-center justify-center'>
                                    <Icon className='h-6 w-6 text-primary mr-2' />
                                    <span className='text-lg font-medium text-gray-900'>{challenge.label}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className='bg-white shadow rounded-lg overflow-hidden'>
                <div className='px-4 py-5 sm:p-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-4'>Active Challenges</h2>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200'>
                            <thead>
                                <tr>
                                    <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Type
                                    </th>
                                    <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Challenge
                                    </th>
                                    <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Participants
                                    </th>
                                    <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Progress
                                    </th>
                                    <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        End Date
                                    </th>
                                    <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                {activeChallenges.map(challenge => {
                                    const Icon = challenge.icon
                                    return (
                                        <tr key={challenge.name} className='hover:bg-gray-50'>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className='flex items-center'>
                                                    <Icon className='h-5 w-5 text-primary mr-2' />
                                                    <span className='text-sm font-medium text-gray-900'>
                                                        {challenge.type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                {challenge.name}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                                {challenge.participants}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                                {challenge.progress}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                                {challenge.endDate}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
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
    )
}
