import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export type PostMeta = {
  slug: string
  title: string
  description: string
  date: string
  dateLabel: string
  tags: string[]
  readingTime: string
}

export type Post = PostMeta & {
  content: string
}

const postsDirectory = path.join(process.cwd(), 'content/posts')
const postExtensions = ['.md', '.mdx']

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function normalizeDate(value: unknown) {
  if (typeof value === 'string') {
    return value
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  return new Date().toISOString()
}

function getSlugFromFileName(fileName: string) {
  return fileName.replace(/\.(md|mdx)$/, '')
}

function isPostFile(fileName: string) {
  return postExtensions.some((extension) => fileName.endsWith(extension))
}

function estimateReadingTime(content: string) {
  const plainText = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]+\}/g, ' ')
    .replace(/[#[\]*_>~()-]/g, ' ')

  const words = plainText.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min de leitura`
}

function readPostFile(fileName: string): Post {
  const slug = getSlugFromFileName(fileName)
  const fullPath = path.join(postsDirectory, fileName)
  const source = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(source)

  const title = typeof data.title === 'string' ? data.title : slug
  const description = typeof data.description === 'string' ? data.description : ''
  const date = normalizeDate(data.date)
  const tags = Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === 'string') : []

  return {
    slug,
    title,
    description,
    date,
    dateLabel: formatDate(date),
    tags,
    readingTime: estimateReadingTime(content),
    content,
  }
}

export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory).filter(isPostFile)

  return fileNames
    .map((fileName) => readPostFile(fileName))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ content: _content, ...meta }) => meta)
}

export function getPostBySlug(slug: string): Post | null {
  const fileName = postExtensions
    .map((extension) => `${slug}${extension}`)
    .find((candidate) => fs.existsSync(path.join(postsDirectory, candidate)))

  if (!fileName) {
    return null
  }

  return readPostFile(fileName)
}
