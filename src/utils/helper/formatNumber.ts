export const thousandSeparatorWithCurrency = (x: string | number) => {
  try {
    return `IDR ${x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
  } catch (e) {
    return null
  }
}

export const thousandSeparator = (x: string | number) => {
  try {
    return `${x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
  } catch (e) {
    return null
  }
}

export const thousandSeparatorComma = (x: string | number): string => {
  try {
    const value = typeof x === 'number' ? x.toString() : x.replace(/[^0-9]/g, '')
    if (!value) return ''
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } catch {
    return ''
  }
}

export const unformatCommaNumber = (value: string): string => {
  return value.replace(/,/g, '')
}

export const formatSeparatorAmount = (value: number | string): string => {
  const numericValue = Number(value)

  if (isNaN(numericValue)) return '0'

  if (numericValue >= 1_000_000_000) {
    return `${(numericValue / 1_000_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    })} B`
  }

  if (numericValue >= 1_000_000) {
    return `${(numericValue / 1_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    })} M`
  }

  return numericValue.toLocaleString()
}
