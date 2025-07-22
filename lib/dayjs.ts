import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime)
dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.locale('en')
dayjs.tz.setDefault('Asia/Ho_Chi_Minh')

export default dayjs
