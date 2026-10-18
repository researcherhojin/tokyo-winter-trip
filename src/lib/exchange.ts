export interface YenRate { date: string; rate: number }
export const exchangeEndpoint = 'https://api.frankfurter.dev/v2/rate/JPY/KRW'
export function parseYenRate(value: unknown): YenRate {
 const data = value as Record<string, unknown> | null
 if (!data || data.base !== 'JPY' || data.quote !== 'KRW' || typeof data.rate !== 'number' || !Number.isFinite(data.rate) || data.rate <= 0 || typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !Number.isFinite(Date.parse(data.date))) throw new Error('Invalid exchange response')
 return {date: data.date, rate: data.rate}
}
