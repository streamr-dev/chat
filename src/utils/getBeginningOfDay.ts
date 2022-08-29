export const DayInMillis = 86400000

export const TimezoneOffset = new Date().getTimezoneOffset() * 60000

export default function getBeginningOfDay(timestamp: number): number {
    return timestamp - ((timestamp - TimezoneOffset) % DayInMillis)
}
