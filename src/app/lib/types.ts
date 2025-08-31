// lib/types.ts
export type SearchQuery = { location?: string; start?: string; end?: string; travelers?: number }
export type Attraction = { id: string; city: string; title: string; image: string; priceFrom?: string; rating?: number }
