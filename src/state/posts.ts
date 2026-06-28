import type { ContentPost, Platform } from '../types/post'

const STORAGE_KEY = 'content-calendar-posts'

const now = new Date()

function nextSlot(dayOffset: number, hour: number): string {
  const date = new Date(now)
  date.setDate(now.getDate() + dayOffset)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

export const seedPosts: ContentPost[] = [
  {
    id: 'post-1',
    title: 'Show your Monday workflow setup',
    content: 'Share your top three tools for a productive week.',
    platform: 'LinkedIn',
    scheduledAt: nextSlot(0, 9),
    status: 'planned',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: 'post-2',
    title: 'Instagram reel: behind the scenes',
    content: 'Capture your content creation routine in 30 seconds.',
    platform: 'Instagram',
    scheduledAt: nextSlot(1, 13),
    status: 'planned',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: 'post-3',
    title: 'Thread: 5 growth lessons this week',
    content: 'Break down your best engagement insights from recent posts.',
    platform: 'Twitter',
    scheduledAt: nextSlot(2, 17),
    status: 'published',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: 'post-4',
    title: 'Carousel: customer success story',
    content: 'Turn one testimonial into a visual case study.',
    platform: 'Instagram',
    scheduledAt: nextSlot(4, 9),
    status: 'planned',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
]

export function loadPosts(): ContentPost[] {
  if (typeof window === 'undefined') {
    return seedPosts
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return seedPosts
  }

  try {
    const parsed = JSON.parse(raw) as ContentPost[]
    return Array.isArray(parsed) ? parsed : seedPosts
  } catch {
    return seedPosts
  }
}

export function savePosts(posts: ContentPost[]): void {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

export function filterPosts(posts: ContentPost[], platforms: Platform[]): ContentPost[] {
  return posts.filter((post) => platforms.includes(post.platform))
}

export function reschedulePost(posts: ContentPost[], postId: string, scheduledAt: string): ContentPost[] {
  return posts.map((post) =>
    post.id === postId
      ? {
          ...post,
          scheduledAt,
          updatedAt: new Date().toISOString(),
        }
      : post,
  )
}

export function updatePost(posts: ContentPost[], updatedPost: ContentPost): ContentPost[] {
  return posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
}
