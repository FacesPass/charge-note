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

export function getCurrentTime(
  noTime = true,
  isChineseTimeSplit = false,
  dateAndTimeSplitStr = '',
) {
  return `${getDate()}${dateAndTimeSplitStr}${noTime ? '' : getTime(isChineseTimeSplit)}`
}

export function getDate() {
  const time = new Date()
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  return `${year}-${prefixZero(month)}-${prefixZero(day)}`
}

export function getTime(isChineseTimeSplit = false) {
  const time = new Date()
  const hour = time.getHours()
  const min = time.getMinutes()
  const sec = time.getSeconds()
  if (isChineseTimeSplit) {
    return `${prefixZero(hour)}时${prefixZero(min)}分${prefixZero(sec)}秒`
  } else {
    return `${prefixZero(hour)}:${prefixZero(min)}:${prefixZero(sec)}`
  }
}

function prefixZero(v: number) {
  let _v = String(v)
  if (v < 10) {
    _v = '0' + _v
  }
  return _v
}
