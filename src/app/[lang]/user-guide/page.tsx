import { USER_GUIDE_CONTENT_SAMPLE } from '@/app/[lang]/user-guide/constants'
import { Card } from '@/components/ui/card'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { ConfigType } from '@/types/config'
import { getWebConfig } from '@/utils/api/internal/webConfig'
import clsx from 'clsx'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'

export default async function Page({ params, ...props }: any) {
  const locale = await getLocal()
  const dict = await getDictionary(params?.lang)
  const webConfig = await getWebConfig()

  const configMap = Object.fromEntries(webConfig.map(item => [item.key, item.value])) as ConfigType

  const userGuide = locale === 'ko' ? configMap['user_guide_ko'] : configMap['user_guide']

  const title = USER_GUIDE_CONTENT_SAMPLE.title
  const subtitle = USER_GUIDE_CONTENT_SAMPLE.subtitle
  const heroImage = USER_GUIDE_CONTENT_SAMPLE.heroImage
  return (
    <>
      {/* Back */}
      {/* <Link href={`/${locale}/banners`} className='w-fit mb-6'>
        <button className='flex items-center gap-2 hover:opacity-90 p-0 h-auto hover:bg-transparent'>
          <ArrowLeft className='w-5 h-5' />
          <span>{dict?.common?.back ?? 'Back'}</span>
        </button>
      </Link> */}

      {/* Title */}
      <div className='mb-3'>
        <h1 className='text-3xl md:text-4xl font-bold'>{title}</h1>
      </div>

      {/* Hero Card */}
      <Card className='relative overflow-hidden mb-8 border-0 bg-[#0F3C37] text-white'>
        <div className='p-6 md:p-8 lg:p-10'>
          <div className='flex items-start justify-between gap-6'>
            <div className='max-w-[70%]'>
              <div className='text-xs md:text-sm opacity-80 mb-2'>KPOKER</div>
              <h2 className='text-2xl md:text-3xl font-bold leading-tight'>
                텍사스 홀덤 <span className='block'>게임설명</span>
              </h2>
            </div>

            <div className='relative w-28 h-20 md:w-40 md:h-28 shrink-0 translate-y-2 rotate-6'>
              {heroImage ? (
                <Image src={heroImage} alt='user guide' fill className='object-cover rounded-md shadow-md' />
              ) : (
                <div className='w-full h-full grid place-items-center bg-white/10 rounded-md'>
                  <ImageIcon className='w-8 h-8' />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Section: Intro */}
      <Section title="텍사스 홀덤 (Texas Hold'em)">
        <Paragraphs items={USER_GUIDE_CONTENT_SAMPLE.intro} />
      </Section>

      {/* Section: 게임 구성과 역할 */}
      <Section title='게임 구성과 역할'>
        <TableCard>
          <TableHeader>
            <TableRow className='bg-[#0E1B2A] border-app-neutral600'>
              <TableHead className='w-[130px] px-6 py-4 text-left font-semibold text-white'>구분</TableHead>
              <TableHead className='px-6 py-4 text-left font-semibold text-white'>내용</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {USER_GUIDE_CONTENT_SAMPLE.gameInfo.map((row, i) => (
              <TableRow key={i} className='border-t border-app-neutral600'>
                <TableCell className='px-6 py-4 font-medium text-app-text-color'>{row.key}</TableCell>
                <TableCell className='px-6 py-4 text-app-text-color'>{row.val}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableCard>
      </Section>

      {/* Section: 블라인드 베팅 */}
      <Section title='블라인드 베팅 (Blind Bet, 강제적 베팅)'>
        <Paragraphs items={USER_GUIDE_CONTENT_SAMPLE.blinds} />
      </Section>

      {/* Section: 게임 진행 단계 및 배팅 순서도 */}
      <Section title='게임 진행 단계 및 배팅 순서도'>
        <TableCard>
          <TableHeader>
            <TableRow className='bg-[#0E1B2A] border-app-neutral600'>
              <TableHead className='w-[130px] px-6 py-4 text-left font-semibold text-white'>순서</TableHead>
              <TableHead className='px-6 py-4 text-left font-semibold text-white'>내용 및 액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {USER_GUIDE_CONTENT_SAMPLE.rounds.map((row, i) => (
              <TableRow key={i} className='border-t border-app-neutral600'>
                <TableCell className='px-6 py-4 font-medium text-app-text-color'>{row.step}</TableCell>
                <TableCell className='px-6 py-4 text-app-text-color'>{row.desc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableCard>
      </Section>

      {/* Section: 액션 관련 용어 */}
      {/* <Section title='액션 관련 용어'>
          <ul className='list-disc pl-5 space-y-1'>
            {USER_GUIDE_CONTENT_SAMPLE.actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section> */}

      <Section title='칩을 걸고 의 흐름 지식 구성'>
        <Paragraphs items={USER_GUIDE_CONTENT_SAMPLE.paragraph1} />
      </Section>

      <Section title='액션 관련 용어'>
        <Paragraphs items={USER_GUIDE_CONTENT_SAMPLE.paragraph2} />
      </Section>

      {/* Section: 포커 족보 수 에베레 수 = 높을 수 */}
      <Section title='포커 족보 (높을수록 강함)'>
        <TableCard>
          <TableHeader>
            <TableRow className='bg-[#0E1B2A] border-app-neutral600'>
              <TableHead className='w-[130px] px-6 py-4 text-left font-semibold text-white'>순위</TableHead>
              <TableHead className='px-6 py-4 text-left font-semibold text-white'>족보 (설명)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {USER_GUIDE_CONTENT_SAMPLE.ranks.map(([name, desc], idx) => (
              <TableRow key={idx} className='border-t border-app-neutral600'>
                <TableCell className='px-6 py-4 font-medium text-app-text-color'>{name}</TableCell>
                <TableCell className='px-6 py-4 text-app-text-color'>{desc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableCard>
      </Section>
    </>
  )
}

/* ---------- helpers / small components ---------- */

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={clsx('mb-8', className)}>
      <h3 className='text-sm md:text-base font-semibold mb-2 text-app-text-color'>{title}</h3>
      <div className='text-app-neutral500 py-4 md:py-6'>{children}</div>
    </section>
  )
}

function TableCard({ children }: { children: React.ReactNode }) {
  return (
    <div className='overflow-hidden rounded-2xl border border-app-neutral600'>
      <table className='w-full text-sm text-app-text-color'>{children}</table>
    </div>
  )
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className='space-y-3 leading-relaxed'>
      {items.map((t, i) => (
        <p className='text-app-text-color' key={i}>
          {t}
        </p>
      ))}
    </div>
  )
}
