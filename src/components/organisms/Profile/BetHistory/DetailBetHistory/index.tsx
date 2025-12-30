'use client'

import { SkeletonDetail } from '@/components/molecules/Skeleton/BetDetailSkeleton'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { DetailBetDTO, DetailPokerDTO, isBet, isPoker } from '@/types/betHistoryDTO'
import { LangProps } from '@/types/langProps'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { format } from 'date-fns'
import { ToastContainer } from 'react-toastify'
import { DetailBetHistoryProps } from './types'

const getTextColor = (status?: string) => {
  if (status === 'won') return 'text-app-success'
  if (status === 'lost') return 'text-app-danger'
  if (status === 'pending') return 'text-app-accentYellow'
  return 'text-app-text-color'
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <p className='text-sm text-app-neutral500 mb-1'>{label}</p>
      <p className='text-app-text-color font-medium break-words'>{value ?? '-'}</p>
    </div>
  )
}

function PokerSection({ detail, lang }: { detail: DetailPokerDTO; lang?: LangProps }) {
  return (
    <div className='space-y-4'>
      <Row label={lang?.detailBet?.transactionNo} value={detail.transactionNo} />
      <Row label={lang?.detailBet?.gameName} value={detail.gameName || '-'} />
      <Row label={lang?.detailBet?.table} value={detail.table} />
      <Row label={lang?.detailBet?.period} value={detail.periode} />
      <Row
        label={lang?.detailBet?.betAmount}
        value={
          detail.currency
            ? `${thousandSeparatorComma(detail.betAmount)} ${detail.currency}`
            : thousandSeparatorComma(detail.betAmount)
        }
      />
      <Row
        label={lang?.detailBet?.resultAmount}
        value={
          detail.currency
            ? `${thousandSeparatorComma(detail.resultAmount)} ${detail.currency}`
            : thousandSeparatorComma(detail.resultAmount)
        }
      />
      <Row
        label={lang?.detailBet?.profit}
        value={
          detail.currency
            ? `${thousandSeparatorComma(detail.profit)} ${detail.currency}`
            : thousandSeparatorComma(detail.profit)
        }
      />
    </div>
  )
}

function BetSection({ detail, lang }: { detail: DetailBetDTO; lang?: LangProps }) {
  return (
    <div className='space-y-4'>
      <Row label={lang?.detailBet?.ticketId} value={detail.ticket_id} />
      <Row label={lang?.detailBet?.winAmount} value={thousandSeparatorComma(detail.win_amount)} />
      <Row
        label={lang?.detailBet?.potentialWin}
        value={thousandSeparatorComma((detail.potential_win + detail.potential_comboboost_win) / 100)}
      />

      {/* Bets Slip */}
      {detail.bets_slip && detail.bets_slip.length > 0 && (
        <div className='space-y-4 mt-6'>
          <p className='text-sm font-semibold text-app-text-color mb-2'>{lang?.detailBet?.betsSlip}</p>
          {detail.bets_slip.map((bet: any, index) => (
            <div key={index} className='p-4 rounded-lg border border-app-neutral600 bg-app-neutral700/50 space-y-2'>
              <Row label={lang?.detailBet?.sportName} value={bet.sport_name} />
              <Row label={lang?.detailBet?.tournamentName} value={bet.tournament_name} />
              <Row label={lang?.detailBet?.tournamentId} value={bet.tournament_id} />
              <Row label={lang?.detailBet?.teamMatch} value={bet.competitor_name} />
              <Row label={lang?.detailBet?.odds} value={bet.odds} />

              <Row
                label={lang?.common?.status}
                value={<span className={cn('uppercase', getTextColor(bet.status?.toLowerCase()))}>{bet.status}</span>}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DetailBetHistory({ lang, detail, open, setOpen, loading }: DetailBetHistoryProps) {
  // const [open, setOpen] = useState(false)

  const getStatusLabel = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'won':
        return lang?.common?.won || 'Won'
      case 'lost':
        return lang?.common?.lost || 'Lost'
      case 'pending':
        return lang?.common?.pending || 'Pending'
      default:
        return lang?.common?.pending || 'Pending'
    }
  }

  const isSkeleton = loading || !detail

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side='right' className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
        <ToastContainer position='top-right' />

        {/* Header */}
        <div className='flex items-center justify-between mt-6 mb-2'>
          <h1 className='text-xl uppercase font-bold text-app-text-color tracking-wide'>
            {lang?.common?.detailBetHistory || 'Detail Bet History'}
          </h1>
        </div>

        {isSkeleton ? (
          // Skeleton while loading
          <div className='animate-pulse text-app-text-color'>
            <SkeletonDetail />
          </div>
        ) : (
          <>
            <div className='mb-6 space-y-1'>
              <p className='text-sm text-app-text-color'>ID: {detail?.id}</p>
              <p className='text-sm text-app-neutral500'>{format(new Date(detail?.createdAt), 'yyyy-MM-dd | HH:mm')}</p>
              <p className={cn('text-sm font-medium uppercase', getTextColor(detail.status))}>
                {lang?.common?.status || 'Status'}: {getStatusLabel(detail.status)}
              </p>
            </div>

            {/* Body by type */}
            <div className='mb-8'>
              {isPoker(detail) ? (
                <PokerSection detail={detail} lang={lang} />
              ) : isBet(detail) ? (
                <BetSection detail={detail} lang={lang} />
              ) : (
                <div className='text-app-neutral500 text-sm'>-</div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
