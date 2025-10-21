import { LangProps } from '@/types/langProps'

enum NotificationType {
  DEPOSIT_APPROVED = 'depositapproved',
  DEPOSIT_REJECTED = 'depositrejected',
  WITHDRAW_APPROVED = 'withdrawapproved',
  WITHDRAW_REJECTED = 'withdrawrejected',
  PROMO_FAILED = 'promofailed',
  KYC_APPROVED = 'kycapproved',
  KYC_REJECTED = 'kycrejected'
}

export const getTitleNotification = (type: string, lang: LangProps | undefined) => {
  switch (type.toLowerCase()) {
    case NotificationType.DEPOSIT_APPROVED:
      return lang?.notification?.depositApprovedTitle || ''
    case NotificationType.DEPOSIT_REJECTED:
      return lang?.notification?.depositRejectedTitle || ''
    case NotificationType.WITHDRAW_APPROVED:
      return lang?.notification?.withdrawApprovedTitle || ''
    case NotificationType.WITHDRAW_REJECTED:
      return lang?.notification?.withdrawRejectedTitle || ''
    case NotificationType.PROMO_FAILED:
      return lang?.notification?.promotionFailedTitle || ''
    case NotificationType.KYC_APPROVED:
      return lang?.notification?.kycApprovedTitle || ''
    case NotificationType.KYC_REJECTED:
      return lang?.notification?.kycRejectedTitle || ''
    default:
      return ''
  }
}

export const getTypeNotification = (type: string, lang: LangProps | undefined) => {
  switch (type.toLowerCase()) {
    case NotificationType.DEPOSIT_APPROVED:
    case NotificationType.DEPOSIT_REJECTED:
      return lang?.common?.deposit || ''
    case NotificationType.WITHDRAW_APPROVED:
    case NotificationType.WITHDRAW_REJECTED:
      return lang?.common?.withdraw || ''
    case NotificationType.KYC_APPROVED:
    case NotificationType.KYC_REJECTED:
      return lang?.common?.kyc || ''
    default:
      return ''
  }
}

export const getMessageNotification = (type: string, lang: LangProps | undefined) => {
  switch (type.toLowerCase()) {
    case NotificationType.DEPOSIT_APPROVED:
      return lang?.notification?.depositApproved || ''
    case NotificationType.DEPOSIT_REJECTED:
      return lang?.notification?.depositRejected || ''
    case NotificationType.WITHDRAW_APPROVED:
      return lang?.notification?.withdrawApproved || ''
    case NotificationType.WITHDRAW_REJECTED:
      return lang?.notification?.withdrawRejected || ''
    case NotificationType.PROMO_FAILED:
      return lang?.notification?.promoFailed || ''
    case NotificationType.KYC_APPROVED:
      return lang?.notification?.kycApproved || ''
    case NotificationType.KYC_REJECTED:
      return lang?.notification?.kycRejected || ''
    default:
      return ''
  }
}
