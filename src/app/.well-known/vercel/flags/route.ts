// src/app/.well-known/vercel/flags/route.ts

export const runtime = 'nodejs' // <- important

import * as flags from '@/utils/flags/flags'
import { createFlagsDiscoveryEndpoint, getProviderData } from 'flags/next'

export const GET = createFlagsDiscoveryEndpoint(() => getProviderData(flags))
