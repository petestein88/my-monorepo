export const formatTime = (minutes: number | null | undefined): string => {
    if (!minutes || isNaN(minutes)) return '0' // Default value for null or invalid numbers

    if (minutes < 60) {
        return `${minutes.toFixed(1)} min`
    } else if (minutes < 1440) {
        return `${(minutes / 60).toFixed(1)} hours`
    } else {
        return `${(minutes / 1440).toFixed(1)} days`
    }
}

// Function to format hours (removes unnecessary decimal places)
const formatHours = (hours: number): string => {
    return hours % 1 === 0 ? `${hours.toFixed(0)}` : `${hours.toFixed(2)}`
}

function formatGlobalHours(hours: number) {
    if (hours >= 1_000_000_000) {
        return (hours / 1_000_000_000).toFixed(2) + 'B'
    } else if (hours >= 1_000_000) {
        return (hours / 1_000_000).toFixed(2) + 'M'
    } else if (hours >= 1_000) {
        return (hours / 1_000).toFixed(2) + 'K'
    } else {
        return hours
    }
}

const dateTime = {
    formatTime,
    formatHours,
    formatGlobalHours
}

export { dateTime }
