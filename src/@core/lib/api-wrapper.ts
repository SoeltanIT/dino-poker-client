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
      10100: 'usernameEmailPasswordRequired',
      10101: 'phoneCodeMustBeValidPrefix',
      10102: 'phoneMustBeNumeric',
      10103: 'dobRequired',
      10104: 'onlyAdminCanRegisterAdmin',
      10105: 'passwordIncorrect',
      10106: 'consentRequiredForRegistration',
      10107: 'usernameEmailOrPasswordInvalid',
      10200: 'invalidInputForUpdate',
      10201: 'userNotFound',
      10202: 'onlyAdminCanChangeUserStatus',
      10203: 'userCannotUpdateOthersProfiles',
      10204: 'usernameEmailAlreadyExists',
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
      15005: 'failedToGetLanguages'
    }

    // Map error codes to fallback English messages
    const errorMessageMap: Record<number, string> = {
      90000: 'Something went wrong while processing your request.',
      90001: 'Validation failed.',
      90002: 'Conflict: resource already exists.',
      90003: 'The requested resource was not found.',
      90004: 'Unauthorized request.',
      90005: 'Forbidden access.',
      30000: 'First deposit promotion already used',
      30001: 'Deposit amount below minimum requirement',
      30002: 'One-time promotion already used',
      30003: 'Daily promotion already used today',
      30004: 'Promotion is not currently active or available',
      30005: 'Failed to query promotion data',
      30006: 'Failed to insert promotion usage record',
      20000: 'Invalid deposit amount',
      20001: 'Transaction password is incorrect',
      20002: 'Failed to use promotion',
      20003: 'Deposit not found',
      20004: 'Deposit already reviewed',
      20005: 'Deposit status is not pending',
      20006: 'Withdraw not found',
      20007: 'Withdraw already reviewed',
      20008: 'Withdraw status is not pending',
      20009: 'Insufficient balance',
      20010: 'Failed to update user balance',
      20011: 'Failed to retrieve user',
      20012: 'Failed to get transactions',
      20013: 'Failed to get withdraws',
      20014: 'Failed to get deposits',
      20015: 'Failed to get bets',
      20016: 'Invalid user ID',
      20017: 'Ongoing promotion blocks withdrawal',
      20018: 'No bets found for the user',
      20019: 'No transactions found for the user',
      10100: 'Username/email and password are required',
      10101: 'Phone number code must be a valid prefix',
      10102: 'Phone number must be numeric',
      10103: 'Date of birth is required',
      10104: 'Only admin can register another admin',
      10105: 'Password is incorrect',
      10106: 'consent is required for registration',
      10107: 'Username/email or password is invalid',
      10200: 'Invalid input for update',
      10201: 'User not found',
      10202: 'Only admin can change user status',
      10203: 'User cannot update other users profiles',
      10204: 'Username/email already exists',
      10205: 'User is already verified',
      10400: 'Invalid account type',
      10401: 'Invalid old password',
      10402: 'The new password cannot be the same as your current password',
      14000: 'Bank with the given code already exists',
      14001: 'Bank not found',
      14002: 'Failed to create new bank',
      14003: 'Failed to update bank',
      14004: 'Failed to delete bank',
      14005: 'Bank group not found',
      14006: 'Failed to create bank group',
      14007: 'Failed to update bank group',
      15000: 'Failed to create config',
      15001: 'Failed to update config',
      15002: 'Failed to fetch config',
      15003: 'Config not found',
      15004: 'Failed to get currencies',
      15005: 'Failed to get languages'
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
