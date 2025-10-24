import { getProviderData, createFlagsDiscoveryEndpoint } from 'flags/next'
import * as flags from '../../../../utils/flags/flags'

export const GET = createFlagsDiscoveryEndpoint(() => getProviderData(flags))
