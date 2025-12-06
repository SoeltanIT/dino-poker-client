// 🔥 API ROUTE WRAPPER - Use this instead of repeating code

import { getDictionary } from '@/dictionaries/dictionaries'
import { Locale } from '@/i18n-config'
import { NextResponse } from 'next/server'

// Simple locale detection for API routes
function getLocaleFromRequest(request: Request): Locale {
  const referer = request?.headers.get('referer') || ''
  return referer.includes('/ko') ? 'ko' : 'en'
}

// 🎯 WRAPPER FUNCTION - Use this in all your API routes
export async function withAuthErrorHandling<T>(
  request: Request,
  handler: () => Promise<T | Response>
): Promise<Response> {
  const locale = getLocaleFromRequest(request)
  const lang = await getDictionary(locale)

  try {
    const result = await handler()

    // 👇 If handler already returned a Response, don't re-wrap it
    if (result instanceof Response) return result

    return NextResponse.json(result)
  } catch (error: any) {
    // console.error('[API Route] Error:', error)

    // Handle 401 errors - Return JSON instead of using cookies()
    if (error.isUnauthorized || error?.response?.status === 401) {
      // console.log('[API Route] 401 detected - returning 401 response')
      // console.log(`[API Route] Using locale: ${locale}`)

      // 🔥 FIX: Return 401 JSON response instead of clearing cookies
      // Let the frontend axios interceptor handle the logout
      return NextResponse.json(
        {
          message: 'Unauthorized - session expired',
          status: 401,
          locale // Include locale for frontend to use
        },
        { status: 401 }
      )
    }

    const code = error?.response?.data?.code
    const fallbackMessage = error?.response?.data?.message || error.message || 'Internal Server Error'

    let localizedMessage = fallbackMessage

    console.log(`[API Route] Error code: ${code}, message: ${localizedMessage}`)

    // Map error codes to error message keys
    const errorKeyMap: Record<number, string> = {
      90000: 'somethingWentWrong',
      90001: 'validationFailed',
      90002: 'conflictResourceExists',
      90003: 'resourceNotFound',
      90004: 'unauthorizedRequest',
      90005: 'forbiddenAccess',
      30000: 'firstDepositPromoUsed',
      30001: 'depositBelowMinimum',
      30002: 'oneTimePromoUsed',
      30003: 'dailyPromoUsedToday',
      30004: 'promoNotActive',
      30005: 'failedQueryPromoData',
      30006: 'failedInsertPromoUsage',
      30007: 'promotionUsageNonCancelable',
      20000: 'invalidDepositAmount', // Only one 20000 key
      20001: 'transactionPasswordIncorrect',
      20002: 'failedUsePromo',
      20003: 'depositNotFound',
      20004: 'depositAlreadyReviewed',
      20005: 'depositStatusNotPending',
      20006: 'withdrawNotFound',
      20007: 'withdrawAlreadyReviewed',
      20008: 'withdrawStatusNotPending',
      20009: 'insufficientBalance',
      20010: 'failedUpdateUserBalance',
      20011: 'failedRetrieveUser',
      20012: 'failedGetTransactions',
      20013: 'failedGetWithdraws',
      20014: 'failedGetDeposits',
      20015: 'failedGetBets',
      10000: 'wrongPassword',
      20016: 'invalidUserId',
      20017: 'ongoingPromoBlocksWithdrawal',
      20018: 'noBetsFoundForUser',
      20019: 'noTransactionsFoundForUser',
      10100: 'usernamePasswordRequired',
      10101: 'phoneCodeMustBeValidPrefix',
      10102: 'phoneMustBeNumeric',
      10103: 'dobRequired',
      10104: 'onlyAdminCanRegisterAdmin',
      10105: 'passwordIncorrect',
      10106: 'consentRequiredForRegistration',
      10107: 'usernameOrPasswordInvalid',
      10200: 'invalidInputForUpdate',
      10201: 'userNotFound',
      10202: 'onlyAdminCanChangeUserStatus',
      10203: 'userCannotUpdateOthersProfiles',
      10204: 'usernameAlreadyExists',
      10205: 'userAlreadyVerified',
      10400: 'invalidAccountType',
      10401: 'invalidOldPassword',
      10402: 'newPasswordSameAsCurrent',
      14000: 'bankCodeAlreadyExists',
      14001: 'bankNotFound',
      14002: 'failedToCreateBank',
      14003: 'failedToUpdateBank',
      14004: 'failedToDeleteBank',
      14005: 'bankGroupNotFound',
      14006: 'failedToCreateBankGroup',
      14007: 'failedToUpdateBankGroup',
      15000: 'failedToCreateConfig',
      15001: 'failedToUpdateConfig',
      15002: 'failedToFetchConfig',
      15003: 'configNotFound',
      15004: 'failedToGetCurrencies',
      15005: 'failedToGetLanguages',
      16005: 'failedToUpdateReferralCommissionLimitSharedSettings',
      16006: 'errSharedSettingsNotFound',
      20020: 'errOngoingWithdrawal',
      20021: 'errOngoingDeposit'
    }

    // Map error codes to fallback English messages
    const errorMessageMap: Record<number, string> = {
      90000: '요청 처리 중 문제가 발생했습니다.',
      90001: '검증 실패',
      90002: '충돌: 리소스가 이미 존재합니다.',
      90003: '요청한 리소스를 찾을 수 없습니다.',
      90004: '권한 없는 요청입니다.',
      90005: '접근이 금지되었습니다.',
      30000: '최초 입금 프로모션이 이미 사용되었습니다.',
      30001: '입금 금액이 최소 요구 금액 미만입니다.',
      30002: '일회성 프로모션이 이미 사용되었습니다.',
      30003: '일일 프로모션은 이미 오늘 사용되었습니다.',
      30004: '프로모션이 현재 활성화되어 있지 않거나 이용할 수 없습니다.',
      30005: '프로모션 데이터를 조회하지 못했습니다.',
      30006: '프로모션 사용 기록을 삽입하지 못했습니다.',
      30007: '현재 이 프로모션은 취소할 수 없습니다',
      20000: '잘못된 입금 금액입니다.',
      20001: '거래 비밀번호가 올바르지 않습니다.',
      20002: '프로모션 사용에 실패했습니다.',
      20003: '입금 내역을 찾을 수 없습니다.',
      20004: '입금이 이미 검토되었습니다.',
      20005: '입금 상태가 대기 중이 아닙니다.',
      20006: '출금 내역을 찾을 수 없습니다.',
      20007: '출금이 이미 검토되었습니다.',
      20008: '출금 상태가 대기 중이 아닙니다.',
      20009: '잔액이 부족합니다.',
      20010: '사용자 잔액 업데이트에 실패했습니다.',
      20011: '사용자를 조회하지 못했습니다.',
      20012: '거래 내역을 가져오지 못했습니다.',
      20013: '출금 내역을 가져오지 못했습니다.',
      20014: '입금 내역을 가져오지 못했습니다.',
      20015: '배팅 내역을 가져오지 못했습니다.',
      10000: '비밀번호가 일치하지 않습니다.',
      20016: '잘못된 사용자 ID입니다.',
      20017: '진행 중인 프로모션으로 인해 출금이 제한됩니다.',
      20018: '사용자의 베팅 내역이 없습니다.',
      20019: '사용자의 거래 내역이 없습니다.',
      10100: 'ID 비밀번호가 필요합니다.',
      10101: '전화번호 국가 코드는 유효한 접두사여야 합니다.',
      10102: '전화번호는 숫자만 가능합니다.',
      10103: '생년월일이 필요합니다.',
      10104: '다른 관리자를 등록할 수 있는 권한은 관리자에게만 있습니다.',
      10105: '비밀번호가 올바르지 않습니다.',
      10106: '등록을 위해 동의가 필요합니다.',
      10107: 'ID 또는 비밀번호가 올바르지 않습니다.',
      10200: '업데이트를 위한 입력이 잘못되었습니다.',
      10201: '사용자를 찾을 수 없습니다.',
      10202: '사용자 상태 변경은 관리자만 가능합니다.',
      10203: '사용자는 다른 사용자의 프로필을 업데이트할 수 없습니다.',
      10204: 'ID가 이미 존재합니다.',
      10205: '사용자가 이미 인증되었습니다.',
      10400: '잘못된 계정 유형입니다.',
      10401: '이전 비밀번호가 올바르지 않습니다.',
      10402: '새 비밀번호는 현재 비밀번호와 같을 수 없습니다.',
      14000: '해당 코드의 은행이 이미 존재합니다.',
      14001: '은행을 찾을 수 없습니다.',
      14002: '신규 은행 생성에 실패했습니다.',
      14003: '은행 업데이트에 실패했습니다.',
      14004: '은행 삭제에 실패했습니다.',
      14005: '은행 그룹을 찾을 수 없습니다.',
      14006: '은행 그룹 생성에 실패했습니다.',
      14007: '은행 그룹 업데이트에 실패했습니다.',
      15000: '구성 생성에 실패했습니다.',
      15001: '구성 업데이트에 실패했습니다.',
      15002: '구성을 가져오지 못했습니다.',
      15003: '구성을 찾을 수 없습니다.',
      15004: '통화를 가져오지 못했습니다.',
      15005: '언어를 가져오지 못했습니다.',
      16005: '커미션 한도 도달: 최대 40%가 이미 할당되었습니다',
      16006: '설정을 찾을 수 없습니다.',
      20020: '진행 중인 거래로 인해 출금이 제한됩니다',
      20021: '진행 중인 거래로 인해 입금이 제한됩니다'
    }

    if (
      code &&
      lang.error &&
      errorKeyMap[code] &&
      typeof (lang.error as Record<string, string>)[errorKeyMap[code]] === 'string'
    ) {
      localizedMessage = (lang.error as Record<string, string>)[errorKeyMap[code]]
    } else if (code && errorMessageMap[code]) {
      localizedMessage = errorMessageMap[code]
    } else {
      localizedMessage = fallbackMessage
    }

    // Handle other errors
    return NextResponse.json(
      {
        message: localizedMessage,
        status: error?.response?.status || 500,
        code: error?.response?.data?.code || 9999
      },
      { status: error?.response?.status || 500 }
    )
  }
}
