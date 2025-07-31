import { useSearchParams } from 'react-router-dom'

export default function useSearchQuery() {
  const [searchParams] = useSearchParams()
  const searchQuery = Object.fromEntries([...searchParams])
  return searchQuery
}
