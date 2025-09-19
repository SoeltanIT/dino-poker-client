// lib/getQueryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// `cache` dari React memastikan bahwa kita hanya membuat satu instance
// QueryClient per request di sisi server.
const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
