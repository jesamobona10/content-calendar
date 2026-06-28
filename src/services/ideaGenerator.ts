const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

export class IdeaGenerationError extends Error {}

function deterministicMockIdeas(niche: string): string[] {
  const normalized = niche.trim().toLowerCase()
  const capitalized = normalized.charAt(0).toUpperCase() + normalized.slice(1)

  return [
    `${capitalized}: 3 mistakes beginners make and how to avoid them`,
    `A weekly ${normalized} trend report your audience can use today`,
    `Behind-the-scenes: how you plan high-performing ${normalized} content`,
    `5-minute ${normalized} checklist for consistent social growth`,
    `Story post: your biggest ${normalized} lesson this month`,
  ]
}

function parseIdeas(raw: string): string[] {
  const lines = raw
    .split('\n')
    .map((line) => line.replace(/^\d+[.)\-]\s*/, '').trim())
    .filter(Boolean)
  return lines.slice(0, 5)
}

export function validateNicheInput(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'Please enter a niche first.'
  }
  if (trimmed.length < 2 || trimmed.length > 80) {
    return 'Niche must be between 2 and 80 characters.'
  }
  return null
}

export async function generateIdeas(
  niche: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string[]> {
  const validationError = validateNicheInput(niche)
  if (validationError) {
    throw new IdeaGenerationError(validationError)
  }

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    return deterministicMockIdeas(niche)
  }

  const response = await fetchImpl(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `******
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You generate concise social media post topic ideas.',
        },
        {
          role: 'user',
          content: `Generate exactly 5 social post topic ideas for the niche: ${niche}. Return each idea on a new line.`,
        },
      ],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new IdeaGenerationError('Unable to generate ideas right now. Please retry.')
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new IdeaGenerationError('Idea provider returned an empty response.')
  }

  const ideas = parseIdeas(content)
  if (ideas.length !== 5) {
    throw new IdeaGenerationError('Idea provider returned an invalid format. Please retry.')
  }

  return ideas
}
