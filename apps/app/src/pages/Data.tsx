import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { utils } from '../utils'
import { http } from '../utils/http'
import Loader from '../common/Loader'
import NoDataToShow from '../common/Placeholders/NoDataToShow'

type ChargingSessionsGrouped = {
    session_date: Date
    sessions_count: number
    total_duration: number
}

type ChargingSessions = {
    created_at: Date
    duration_end: number
}

const groupedData = {}

export default function Data() {
    const [loading, setLoading] = useState(true)
    const [chargingSessions, setChargingSessions] = useState<ChargingSessions[]>([])
    const [chargingSessionsGrouped, setChargingSessionsGrouped] = useState<ChargingSessionsGrouped[]>([])

    useEffect(() => {
        loadUserChargingSessionHistory()
    }, [])

    const loadUserChargingSessionHistory = async () => {
        try {
            const response = await http({
                url: 'charging-session/user',
                method: 'GET'
            })

            const { sessions, groupedSessions } = response.data.data

            const chargingSessionsGrouped = groupedSessions.map(currentChargingSession => {
                return {
                    session_date: new Date(currentChargingSession.session_date),
                    sessions_count: parseInt(currentChargingSession.sessions_count),
                    total_duration: parseFloat((parseInt(currentChargingSession.total_duration) / 60).toFixed(1))
                } as ChargingSessionsGrouped
            })

            const chargingSessions = sessions.map(currentChargingSession => {
                return {
                    ...currentChargingSession,
                    created_at: new Date(currentChargingSession.created_at)
                } as ChargingSessionsGrouped
            })

            setChargingSessions(chargingSessions)
            setChargingSessionsGrouped(chargingSessionsGrouped)
        } catch (error: any) {
            utils.toast.error(utils.error.handler(error))
        } finally {
            setLoading(false)
        }
    }

    // Generate last 7 days of data
    const dates = loading
        ? []
        : Array.from({ length: chargingSessionsGrouped.length }, (_, i) => {
              const date = chargingSessionsGrouped[i].session_date
              return {
                  date,
                  hours: chargingSessionsGrouped[i].total_duration, // Random hours between 4-12
                  sessions: chargingSessionsGrouped[i].sessions_count // Random sessions between 1-3
              }
          }).reverse()

    // Reorder hours to start from 12 PM
    const reorderedHours = [...Array(24)].map((_, i) => (i + 12) % 24)

    // Calculate the maximum value for the y-axis
    const maxHours = Math.max(...dates.map(d => d.hours))
    const yAxisMax = Math.ceil(maxHours / 2) * 2 // Round up to nearest even number

    chargingSessions.forEach(({ created_at, duration_end }) => {
        const startTime = new Date(created_at)
        const endTime = new Date(startTime.getTime() + duration_end * 60000)

        const dateKey = new Date(startTime).setHours(0, 0, 0, 0)

        if (!groupedData[dateKey]) {
            groupedData[dateKey] = []
        }

        groupedData[dateKey].push({ startTime, endTime })
    })

    // Generate hourly data for each day
    const hourlyData = Object.entries(groupedData).map(([dateKey, timeRanges]: [string, any[]]) => {
        const date = new Date(parseInt(dateKey)) // Convert back to ISO format

        const hours = Array.from({ length: 24 }, (_, i) => {
            const hour = i === 0 ? 12 : i > 12 ? i - 12 : i
            const period = i >= 12 ? 'PM' : 'AM'

            // Check if this hour is in any duration range
            const inBox = timeRanges.some(({ startTime, endTime }) => {
                const hourStart = new Date(startTime)
                hourStart.setHours(i, 0, 0, 0)
                return hourStart >= startTime && hourStart <= endTime
            })

            return { hour, period, inBox }
        })

        return { date, hours }
    })

    return (
        <div className='space-y-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <div className='bg-white shadow rounded-lg overflow-hidden'>
                    <div className='px-4 py-5 sm:p-6'>
                        <h3 className='text-lg font-medium text-gray-900 mb-4'>Daily Summary</h3>
                        <div className='overflow-x-auto'>
                            {loading ? (
                                <div className='flex justify-center items-center min-h-[150px] md:min-h-[200px]'>
                                    <Loader size='md' />
                                </div>
                            ) : !dates.length ? (
                                <NoDataToShow text='No data available. Charge your device to start recording daily session data.' />
                            ) : (
                                <table className='min-w-full divide-y divide-gray-200'>
                                    <thead>
                                        <tr>
                                            <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                Date
                                            </th>
                                            <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                Hours
                                            </th>
                                            <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                Sessions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-200'>
                                        {dates.map(day => (
                                            <tr key={day.date.toISOString()}>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                                    {format(day.date, 'EEEE, MMMM d, yyyy')}
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                                    {day.hours}
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                                    {day.sessions}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                <div className='bg-white shadow rounded-lg overflow-hidden'>
                    <div className='px-4 py-5 sm:p-6'>
                        <h3 className='text-lg font-medium text-gray-900 mb-4'>Hourly Activity</h3>
                        <div className='overflow-x-auto'>
                            {loading ? (
                                <div className='flex justify-center items-center min-h-[150px] md:min-h-[200px]'>
                                    <Loader size='md' />
                                </div>
                            ) : !hourlyData.length ? (
                                <NoDataToShow text='No activity data yet. Connect and charge your device to view hourly progress.' />
                            ) : (
                                <table className='min-w-full divide-y divide-gray-200'>
                                    <thead>
                                        <tr>
                                            <th className='px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0'>
                                                Date
                                            </th>
                                            {reorderedHours.map(hour => (
                                                <th
                                                    key={hour}
                                                    className='px-3 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                                                >
                                                    {hour === 0 ? '12' : hour > 12 ? hour - 12 : hour}
                                                    <span className='text-gray-400'>{hour >= 12 ? 'pm' : 'am'}</span>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-200'>
                                        {hourlyData.map(day => (
                                            <tr key={day.date.toISOString()}>
                                                <td className='px-3 py-4 whitespace-nowrap text-xs font-medium text-gray-900 sticky left-0 bg-white'>
                                                    {format(day.date, 'MM/dd')}
                                                </td>

                                                {reorderedHours.map((hour, i) => (
                                                    <td
                                                        key={i}
                                                        className={`px-3 py-4 text-center ${day.hours[hour].inBox ? 'bg-indigo-100' : ''}`}
                                                    >
                                                        <span className='w-4 h-4 inline-block'></span>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white shadow rounded-lg overflow-hidden'>
                <div className='px-4 py-5 sm:p-6'>
                    <h3 className='text-lg font-medium text-gray-900 mb-6'>Time Saved</h3>
                    <div className='h-full'>
                        {loading ? (
                            <div className='flex justify-center items-center min-h-[150px] md:min-h-[200px]'>
                                <Loader size='md' />
                            </div>
                        ) : !dates.length ? (
                            <NoDataToShow text='Time saved data will appear here once you start a charging session.' />
                        ) : (
                            <>
                                <div className='flex h-full'>
                                    {/* Y-axis */}
                                    <div className='flex flex-col justify-between pr-4 text-sm text-gray-600 mb-[15px]'>
                                        <div className='h-6 -rotate-90 origin-left translate-y-10 font-medium absolute'>
                                            Hours
                                        </div>
                                        {Array.from({ length: yAxisMax + 1 }, (_, i) => {
                                            return yAxisMax - i
                                        }).map(tick => (
                                            <div key={tick} className='h-6 flex items-center justify-end w-8'>
                                                {tick}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Graph area */}

                                    <div className='flex-1'>
                                        <div className='h-full overflow-x-auto max-w-[calc(100%-112px)]'>
                                            <div className='h-full flex items-end justify-start px-4 max-md:space-x-10 md:space-x-20'>
                                                {dates.map(day => (
                                                    <div
                                                        key={day.date.toISOString()}
                                                        className='flex flex-col h-full justify-end items-center'
                                                    >
                                                        <div
                                                            className='w-12 bg-primary rounded-t transition-all duration-500 ease-in-out hover:bg-indigo-500'
                                                            style={{
                                                                // height: `${(day.hours / yAxisMax) * 100}%`,
                                                                height: `${day.hours * 24}px`,
                                                                minHeight: '24px'
                                                            }}
                                                        >
                                                            <div className='px-2 py-1 text-white text-center text-sm font-medium'>
                                                                {day.hours}h
                                                            </div>
                                                        </div>
                                                        <div className='mt-2 text-sm text-gray-600 whitespace-nowrap'>
                                                            {format(day.date, 'MMM d')}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* X-axis label */}
                                <div className='text-sm font-medium text-gray-600 w-full text-center mt-4'>Date</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
