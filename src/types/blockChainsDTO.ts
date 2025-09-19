export interface BlockchainsDTO {
  chain_type: string
  confirmations_required: number
  id: number
  name: string
  network_params: { chain_id: number; network_name: string; requires_api_key: boolean }
  network_type: string
  provider_url: string
}

export interface BlockchainsTokenDTO {
  is_active: boolean
  is_token: boolean
  name: string
  non_volatile: boolean
  symbol: string
}
