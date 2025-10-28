export const API_ENDPOINT = {
  // User-related
  login: '/v1/login',
  logout: '/v1/logout',
  register: '/v1/register',
  myself: '/v1/me',
  user_update: '/v1/update',
  change_password: '/v1/change-password',
  config: '/v1/config',
  balance: '/v1/balance/me',
  move_balance: '/v1/move-balance',
  transfer_IDN_balance: '/v1/aggregator/sync-balance',
  transfer_fee_rate: '/v1/fee-rate',

  // Referral-related
  referral: '/v1/referral',
  rakeBackBonus: '/v1/referral/rakeback',
  rakeBackClaim: '/v1/referral/rakeback/claim',
  referral_claim: '/v1/referral-claim',
  referral_history: '/v1/referral-history',
  referral_group_history: '/v1/group-referral-history',
  referral_summary: '/v1/referral-summary',
  referral_settings: '/v1/referral/shared-settings',
  affiliates: '/v1/affiliates',
  affiliates_user: '/v1/user-affiliate',
  group_referral: '/v1/group-referral',
  betby_token: '/v1/token',
  seo: '/v1/seo',
  affiliate_claim: '/v1/affiliate-claim',

  promotion: '/v1',
  my_promotion: '/v1/me',
  my_promotion_history: '/v1/me/history',

  notification: '/v1/notifications',
  notification_count: '/v1/notifications/count',

  // Transaction-related
  deposit: '/v1/deposit',
  depositCrypto: '/v1/cryptos/deposit',
  withdraw: '/v1/withdraw',
  history: '/v1/history',
  transaction_history: '/v1',
  transaction_crypto: '/v1/cryptos',
  bet_history: '/v1/bets/history',
  detail_bet_history: '/v1/bets',
  blockchains: '/v1/cryptos/blockchains',
  blockchains_token: '/v1/cryptos/tokens',
  cryptos_supported: '/v1/cryptos/supported',
  // poker_history: '/v1/win-lose-history',
  poker_history: '/v1',
  transfer_history: '/v1/transfer/history',

  //game-related
  game_list: '/v1/aggregator/games',
  game_play: '/v1/aggregator/games/play',

  // Storage or uploads
  uploadImage: '/v1/storage/private-image',

  // Master data
  master_bank: '/v1/bank-provider'
} as const

export type EndpointKey = keyof typeof API_ENDPOINT

export function getApiEndpoint(key: EndpointKey): string {
  return API_ENDPOINT[key]
}
