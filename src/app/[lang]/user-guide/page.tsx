import { Card } from '@/components/ui/card'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { ConfigType } from '@/types/config'
import { getWebConfig } from '@/utils/api/internal/webConfig'
import clsx from 'clsx'
import { ArrowLeft, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const CONTENT = {
  title: '텍사스 홀덤 게임설명',
  subtitle: '텍사스 홀덤 이용가이드',
  heroImage: '/images/default/user_guide.png',

  intro: [
    '텍사스 홀덤은 52 장의 포커 카드(조커는 사용하지 않습니다)로 진행하는 가장 대표적인 2~9인이 즐기는 커뮤니티 카드 게임(Community Card Game)입니다. 각자가 지급 받은 2장의 개인카드(홀카드/개인카드)와 테이블 위에 5장의 공용 카드(커뮤니티 카드)가 있으며 이 중 5장의 카드를 사용하여 높은 족보를 만들어 베팅하는 게임입니다.'
  ],

  gameInfo: [
    {
      key: '게임방식',
      val: '온 테이블에서 2장의 **홀카드(Hole Cards)**가 각자에 공개되지 않고 개인카드를 배분받고 커뮤니티 카드를 공유로서 총 5장을 이용 합니다.'
    },
    { key: '인원', val: '2명 ~ 9명 테이블의 규칙에 따라 입장하실 수 있습니다.)' },
    { key: '게임목적', val: '5-9장 칩은 높은 순위 패로 획득' }
  ],

  blinds: [
    '플레이 게임의 시작을 위해 강제적으로 일정금액을 베팅하게 하는 금액 및 규칙 입니다.',
    '딜러 오른쪽 선수(Small Blind)**만큼 반드시 베팅하여야 하고 2번 선수 (Big Blind)**는 Small Blind의 2배를 베팅해야 하며, 게임이 시작하고 나서 블라인드 플레이어의 베팅값이 다른 플레이어를 위의 스타팅 포인트가 됩니다.',
    '블라인드 베팅 이후 배분된 카드만으로 판단하여 게임에 참가할지 여부를 결정하며, 이후 뒤에 1장씩 차례로 오픈되어 (Community 카드입니다.'
  ],

  rounds: [
    {
      step: '프리 플랍',
      desc: '소스와 빅 블라인더가 지정 베팅을 한후나 한 후이며 블라인드에게 2장의 카드를 줍니다 모두에게 베팅하며 이에 모든 플레이어가 배팅을 합니다.'
    },
    { step: '플랍', desc: '	공통 커뮤니티 카드 3장이 앞면 상태로 열려있습니다 배팅이 시작됩니다.' },
    { step: '턴', desc: '추가로 커뮤니티 카드를 1장 공개합니다 베팅이 시작됩니다.' },
    { step: '리버', desc: '마지막 커뮤니티 카드 1장 합계 5장이 오픈이 됩니다 최종 배팅이 시작됩니다.' },
    { step: '쇼다운', desc: '리버 베팅이 끝나 쇼 타이밍에 대 검증하여 가장 큰 플레이어가 판돈을 모두 가져간다.' }
  ],

  paragraph1: [
    '진주 베팅액의 크기는 첫 블라인드 액수 이상이 되어야 합니다.',
    '블라인드 블라인드로 시작 베팅 게임이 진행되며 시간이 지날수록 블라인드 금액이 상승합니다',
    '딜러의 베팅 불라인드 블라인드로 칩을 걸게 되며 남으면 계속해서 강제 베팅을 해야합니다.'
  ],

  paragraph2: [
    '각 게임 라운드에서 플레이어가 상황과 전략에 따라 선택할 수 있는 액션은 다음과 같습니다.',
    '게임 매칭 시 바탕스 → 스몰 블라인드 → 빅 블라인드(딜러 기준으로 시작하여 시계 방향으로 순환됨',
    '딜러 베팅은 플로우 블라인드가 칩을 걸게 되며 게임에 참여한 다른 플레이어는 아래의 선택을 기초안에서 게임합니다.',
    '플레이어 딜러 베팅에 대한 칩을 베팅 후에는 선택 권한이 가능하지않습니다. 본인의 규정된 시간 안에 정의된 가에 개인 행동을 하세요.'
  ],

  actions: [
    '폴드(Fold): 패를 포기하고 라운드에서 하차.',
    '체크(Check): 베팅 없이 턴을 넘김(이전 베팅이 없을 때 가능).',
    '콜(Call): 현재 최고 베팅액과 동일하게 맞춤.',
    '베트/레이즈(Bet/Raise): 새로 베팅하거나 기존 베팅보다 금액을 올림.',
    '올인(All-in): 보유 칩 전부를 베팅.'
  ],

  ranks: [
    ['로얄 플러시', '(같은 문양의 에이스 킹은 카드, 5장 가지 카드 숫자인 플러쉬 숫자를 순서대로 가졌습니다.)'],
    ['스 플러시', '같은 숫자대로 카드 2 결과만이 연속적인 획득'],
    ['포 카드', '숫자만 같은 4장의 카드와 나머지 1 그럴 것 수종에선 획득'],
    ['풀하우스', '같은 숫자의 카드 3장으로 이루어진 확률'],
    ['스트레이트', '맥락별로 숫자 5장으로 이루어진 태양 (같은 옵션은 뗄만)'],
    ['플러시', '같은 무늬의 카드 5장으로 이루어진 획득 (바로 무늬는 돌리)'],
    ['투 페어스', '트리플 1장 + 페어 1장으로 이루어진 획득. (노트북을 숫자가 높을수록 획득)'],
    ['원 페어', '같은 숫자의 카드 2장으로 이루어진 획득'],
    ['스트레이트의 플러쉬시', '맥락별로 숫자 5미터인 카드 칩이 전환 5장으로 이루어진 이루어진 획득'],
    [
      '관의 스트레이트 플러시시',
      '가장 높은 스트레이트 플러시가 10, J, Q, K, A이고 10이 것은 외수는 외주누를 스트레이트 획득합니다.'
    ]
  ]
}

export default async function Page({ params, ...props }: any) {
  const locale = await getLocal()
  const dict = await getDictionary(params?.lang)
  const webConfig = await getWebConfig()

  const configMap = Object.fromEntries(webConfig.map(item => [item.key, item.value])) as ConfigType

  const userGuide = locale === 'ko' ? configMap['user_guide_ko'] : configMap['user_guide']

  const title = CONTENT.title
  const subtitle = CONTENT.subtitle
  const heroImage = CONTENT.heroImage
  return (
    <div className='min-h-screen flex flex-col w-full md:w-[870px] text-app-text-color px-6 lg:px-16 my-10 mx-auto'>
      <div className='container mx-auto flex flex-col'>
        {/* Back */}
        <Link href={`/${locale}/banners`} className='w-fit mb-6'>
          <button className='flex items-center gap-2 hover:opacity-90 p-0 h-auto hover:bg-transparent'>
            <ArrowLeft className='w-5 h-5' />
            <span>{dict?.common?.back ?? 'Back'}</span>
          </button>
        </Link>

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
          <Paragraphs items={CONTENT.intro} />
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
              {CONTENT.gameInfo.map((row, i) => (
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
          <Paragraphs items={CONTENT.blinds} />
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
              {CONTENT.rounds.map((row, i) => (
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
            {CONTENT.actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section> */}

        <Section title='칩을 걸고 의 흐름 지식 구성'>
          <Paragraphs items={CONTENT.paragraph1} />
        </Section>

        <Section title='액션 관련 용어'>
          <Paragraphs items={CONTENT.paragraph2} />
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
              {CONTENT.ranks.map(([name, desc], idx) => (
                <TableRow key={idx} className='border-t border-app-neutral600'>
                  <TableCell className='px-6 py-4 font-medium text-app-text-color'>{name}</TableCell>
                  <TableCell className='px-6 py-4 text-app-text-color'>{desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableCard>
        </Section>
      </div>
    </div>
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
