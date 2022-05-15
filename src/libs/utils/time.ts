import dayjs from 'dayjs'

/** 时间转成时间戳 */
export function timeToTimestamp(time: string): string {
  return String(dayjs(time).valueOf())
}

/** 时间戳转成时间 */
export function timestampToTime(
  timestamp: number | string | undefined,
  format = 'YYYY-MM-DD HH:mm:ss',
  isSec = true,
): string {
  if (!timestamp) return 'empty timestamp'
  let _timestamp = timestamp
  if (typeof _timestamp === 'string') {
    _timestamp = parseInt(_timestamp)
  }

  if (isSec) {
    return dayjs.unix(_timestamp).format(format)
  } else {
    return dayjs(_timestamp).format(format)
  }
}
