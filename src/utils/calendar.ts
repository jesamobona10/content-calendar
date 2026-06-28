import type { ContentPost } from '../types/post'

export const SLOT_HOURS = [9, 13, 17]

export const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

export const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
})

export function getWeekStart(date: Date): Date {
  const result = new Date(date)
  const day = result.getDay()
  const diff = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}

export function getWeekDays(referenceDate = new Date()): Date[] {
  const weekStart = getWeekStart(referenceDate)
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + index)
    return day
  })
}

export function createSlotDate(day: Date, hour: number): string {
  const slot = new Date(day)
  slot.setHours(hour, 0, 0, 0)
  return slot.toISOString()
}

export function groupPostsBySlot(posts: ContentPost[]): Record<string, ContentPost[]> {
  return posts.reduce<Record<string, ContentPost[]>>((acc, post) => {
    const slot = new Date(post.scheduledAt)
    slot.setMinutes(0, 0, 0)
    const slotId = slot.toISOString()
    if (!acc[slotId]) {
      acc[slotId] = []
    }
    acc[slotId].push(post)
    return acc
  }, {})
}
