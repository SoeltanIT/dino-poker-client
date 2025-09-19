export const API_ENDPOINT = {
  // User-related
  login: '/v1/users/login',
  logout: '/v1/users/logout',
  register: '/v1/users/register',
  myself: '/v1/users/me',
  user_update: '/v1/users/update',
  change_password: '/v1/users/change-password',
  config: '/v1/config',
  balance: '/v1/balance/me',
  move_balance: '/v1/move-balance',
  referral: '/v1/users/referral',
  referral_claim: '/v1/users/referral-claim',
  referral_history: '/v1/users/referral-history',
  referral_summary: '/v1/users/referral-summary',
  betby_token: '/v1/users/token',
  seo: '/v1/seo',

  promotion: '/v1/promotions',
  my_promotion: '/v1/promotions/me',
  my_promotion_history: '/v1/promotions/me/history',

  notification: '/v1/notifications',
  notification_count: '/v1/notifications/count',

  // Transaction-related
  deposit: '/v1/transactions/deposit',
  depositCrypto: '/v1/transactions/cryptos/deposit',
  withdraw: '/v1/transactions/withdraw',
  history: '/v1/transactions/history',
  transaction_history: '/v1/transactions',
  transaction_crypto: '/v1/transactions/cryptos',
  bet_history: '/v1/transactions/bets/history',
  blockchains: '/v1/transactions/cryptos/blockchains',
  blockchains_token: '/v1/transactions/cryptos/tokens',

  // Storage or uploads
  uploadImage: '/v1/storage/private-image',

  // Master data
  master_bank: '/v1/bank-provider'
} as const

export type EndpointKey = keyof typeof API_ENDPOINT

export function getApiEndpoint(key: EndpointKey): string {
  return API_ENDPOINT[key]
}
