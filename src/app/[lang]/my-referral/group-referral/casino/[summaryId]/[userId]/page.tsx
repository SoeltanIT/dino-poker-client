import { getDictionary } from '@/dictionaries/dictionaries'

export default async function CasinoSummaryPerUserPage() {
  const dict = await getDictionary()
  return (
    <div>
      <div className='mb-[36px]'>
        <h1 className='text-3xl font-bold text-app-text-color uppercase'>Hello</h1>
      </div>
    </div>
  )
}
