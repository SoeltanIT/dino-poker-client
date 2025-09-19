export type ConfigItem = {
  id: number
  key: string
  value: string
  description: string
  updatedAt: string
}

export interface ConfigType {
  livechat_id: string
  deposit_instruction: string
  footer_content: string
  [key: string]: string
}
