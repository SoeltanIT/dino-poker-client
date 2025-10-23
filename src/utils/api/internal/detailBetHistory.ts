import { serverApiClient } from '@/@core/lib/axios-client'
import { DetailBetDTO, DetailPokerDTO } from '@/types/betHistoryDTO'
import { getApiEndpoint } from '@/utils/api_endpoint'

const mapDetailBetHistory = (item: any): DetailBetDTO => {
  const status = (item?.status ?? '-').toString().toLowerCase()

  // In your samples, tournament fields aren’t in details; default to '-'
  return {
    type: 'bet',
    id: item?.id ?? '-',
    provider: item?.provider ?? '-',
    status,
    createdAt: item?.created_at ?? '',
    tournamentId: item?.tournament_id ?? '-', // fallback; adjust if BE changes
    tournamentName: item?.tournament_name ?? '-', // fallback
    betType: item?.bet_type ?? '-', // fallback if your BE adds these later
    betName: item?.bet_name ?? '-',
    betTeam: item?.bet_team ?? '-',
    matchId: item?.match_id ?? undefined,
    matchName: item?.match_name ?? undefined,
    gameName: item?.game_name ?? undefined
  }
}

const mapDetailPokerHistory = (item: any): DetailPokerDTO => {
  const status = (item?.status ?? item?.details?.status ?? '-').toString().toLowerCase()

  return {
    type: 'poker',
    id: item?.id ?? '-',
    provider: item?.provider ?? 'poker',
    status,
    createdAt: item?.created_at ?? '',
    transactionNo: item?.details?.transaction_no ?? '-',
    table: item?.details?.table ?? '-',
    periode: item?.details?.periode ?? '-',
    betAmount: Number(item?.details?.curr_bet ?? 0),
    resultAmount: Number(item?.details?.curr_amount ?? 0),

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

export const getDetailBetHistory = async (id: string): Promise<any> => {
  try {
    const res = await serverApiClient.get(`${getApiEndpoint('detail_bet_history')}/${id}`, undefined, 'transaction')

    const rawData = res?.data?.data

    if (!rawData) return null

    const isPoker =
      (rawData?.provider ?? '').toLowerCase() === 'poker' || (rawData?.details?.game ?? '').toUpperCase() === 'TXH'

    const mappedData = isPoker ? mapDetailPokerHistory(rawData) : mapDetailBetHistory(rawData)

    return mappedData
  } catch (err) {
    console.log('error detail bet history', err)
  }
}
