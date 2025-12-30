import { serverApiClient } from '@/@core/lib/axios-client'
import { DetailBetDTO, DetailBetHistoryRawResponseDTO, DetailPokerDTO, DetailUnionDTO } from '@/types/betHistoryDTO'
import { getApiEndpoint } from '@/utils/api_endpoint'

const mapDetailBetHistory = (item: DetailBetHistoryRawResponseDTO): DetailBetDTO => {
  const status = (item?.status ?? 'pending').toString().toLowerCase()
  console.log('status', status)
  // In your samples, tournament fields aren't in details; default to '-'
  return {
    type: 'bet',
    id: item?.id ?? '-',
    provider: 'betby',
    ticket_id: item?.ticket_id ?? '-',
    win_amount: item?.win_amount ?? 0,
    status,
    createdAt: item?.created_at ?? '',
    created_at: item?.created_at ?? '',
    potential_comboboost_win: item?.details?.potential_comboboost_win ?? 0,
    potential_win: item?.details?.potential_win ?? 0,
    bets_slip: (item?.details?.betslip?.bets ?? []).map((bet: any) => ({
      tournament_id: bet?.tournament_id ?? '-',
      tournament_name: bet?.tournament_name ?? '-',
      updated_odds: Number(bet?.updated_odds ?? 0),
      Competitor_name: Array.isArray(bet?.competitor_name)
        ? bet.competitor_name.join(' vs ')
        : bet?.competitor_name ?? '-',
      Odds: Number(bet?.updated_odds ? bet?.updated_odds : bet?.odds ?? 0),
      Status: bet?.status ?? '-',
      sport_name: bet?.sport_name ?? '-'
    }))
  }
}

const mapDetailPokerHistory = (item: any): DetailPokerDTO => {
  const status = (item?.status ?? item?.details?.status ?? '-').toString().toLowerCase()

  return {
    type: 'poker',
    id: item?.id ?? '-',
    provider: 'idn_poker',
    status,
    createdAt: item?.created_at ?? '',
    transactionNo: item?.details?.transaction_no ?? '-',
    table: item?.details?.table ?? '-',
    periode: item?.details?.periode ?? '-',
    betAmount: Number(item?.details?.curr_bet ?? 0),
    resultAmount: Number(item?.details?.curr_amount ?? 0),
    profit: Number(item?.details?.profit ?? 0),
    // optional extras (useful in UI)
    matchId: item?.match_id ?? undefined,
    matchName: item?.match_name ?? undefined,
    gameName: item?.game_name ?? undefined,
    hand: item?.details?.hand ?? undefined,
    card: item?.details?.card ?? undefined,
    room: item?.details?.room ?? undefined,
    tableNo: item?.details?.tableno ?? undefined,
    currency: item?.details?.curr_player ?? undefined
  }
}

export const getDetailBetHistory = async (id: string): Promise<DetailUnionDTO | null> => {
  try {
    const res = await serverApiClient.get<{ data: any }>(
      `${getApiEndpoint('detail_bet_history')}/${id}`,
      undefined,
      'transaction'
    )

    const rawData: any = res?.data?.data
    if (!rawData) {
      return null
    }

    const provider = (rawData?.provider ?? '').toLowerCase()
    const isPoker = provider === 'idn_poker'

    // Safe logging - only log betslip for betby provider
    if (!isPoker && rawData?.details?.betslip?.bets) {
    } else if (isPoker) {
    }

    if (isPoker) {
      const mappedData = mapDetailPokerHistory(rawData)
      return mappedData
    } else {
      const mappedData = mapDetailBetHistory(rawData as DetailBetHistoryRawResponseDTO)
      return mappedData
    }
  } catch (err: any) {
    return null
  }
}
