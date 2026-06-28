import type { ContentPost, Platform } from '../types/post'
import { PLATFORM_OPTIONS } from '../types/post'
import { getWeekDays } from './calendar'

export type WeeklyPoint = {
  day: string
  count: number
}

export type PlatformPoint = {
  platform: Platform
  count: number
}

const shortDayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })

export function getPostsPerDay(posts: ContentPost[], referenceDate = new Date()): WeeklyPoint[] {
  const days = getWeekDays(referenceDate)

  return days.map((day) => {
    const nextDay = new Date(day)
    nextDay.setDate(day.getDate() + 1)

    const count = posts.filter((post) => {
      const scheduled = new Date(post.scheduledAt)
      return scheduled >= day && scheduled < nextDay
    }).length

    return {
      day: shortDayFormatter.format(day),
      count,
    }
  })
}

export function getPlatformBreakdown(posts: ContentPost[]): PlatformPoint[] {
  return PLATFORM_OPTIONS.map((platform) => ({
    platform,
    count: posts.filter((post) => post.platform === platform).length,
  }))
}
