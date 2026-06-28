export const PLATFORM_OPTIONS = ['Instagram', 'LinkedIn', 'Twitter'] as const

export type Platform = (typeof PLATFORM_OPTIONS)[number]

export const STATUS_OPTIONS = ['planned', 'published'] as const

export type PostStatus = (typeof STATUS_OPTIONS)[number]

export type ContentPost = {
  id: string
  title: string
  content: string
  platform: Platform
  scheduledAt: string
  status: PostStatus
  createdAt: string
  updatedAt: string
}
