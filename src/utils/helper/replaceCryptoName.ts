const ReplaceCryptoName = (value: string, targetString: string, replaceString?: string) => {
  if (!replaceString) return value // fallback to original string
  const cryptoName = replaceString.toUpperCase()
  return value.replace(new RegExp(targetString, 'g'), cryptoName)
}

export default ReplaceCryptoName
