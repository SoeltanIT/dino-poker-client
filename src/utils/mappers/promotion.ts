export type PromotionApi = {
  id: string
  name: string
  banner: string
  content: string // HTML string
  status: 'active' | 'inactive' | string
  start_date?: string
  end_date?: string
  min_bonus?: number
  max_bonus?: number
  bonus_amount_percentage?: number
  bonus_amount?: number
  rolling_condition?: number
  min_deposit?: number
  activation_type?: string
  created_at?: string
  updated_at?: string
}

export type PromotionUI = {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  ctaText?: string
  ctaHref?: string
}

/** strip tag sederhana buat preview subtitle */
function stripHtml(html?: string, fallback = '') {
  if (!html) return fallback
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** pilih CTA default kalau mau diarahkan ke detail */
function buildCta(p: PromotionApi) {
  return {
    ctaText: 'More Info',
    ctaHref: `/promotion/${p.id}`
  }
}

export function mapPromotionList(apiList?: PromotionApi[]): PromotionUI[] {
  if (!apiList?.length) return []
  return apiList.map(p => ({
    id: p.id,
    title: p.name ?? 'Promotion',
    subtitle: stripHtml(p.content, ''), // jadikan plain text singkat
    imageUrl: p.banner, // ← langsung pakai URL S3 kamu
    ...buildCta(p)
  }))
}
