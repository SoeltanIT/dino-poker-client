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
    return '-'
  }
}

export const thousandSeparatorComma = (x: string | number): string => {
  try {
    // Convert to number
    const numericValue = typeof x === 'number' ? x : parseFloat(x)

    if (isNaN(numericValue)) return ''

    // flooring number
    const floor = Math.floor(numericValue)

    // Split into integer and decimal parts
    const parts = floor.toString().split('.')

    // Add thousand separators to integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    // Join back with decimal part if it exists
    return parts.join('.')
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
