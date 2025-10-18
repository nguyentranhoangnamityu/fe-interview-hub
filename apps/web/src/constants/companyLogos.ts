const overrides: Record<string, string> = {
  'nab-front-end-engineer': new URL('../assets/company/nab.svg', import.meta.url).href,
  'axon-fullstack': new URL('../assets/company/axon.svg', import.meta.url).href,
}

export const getCompanyLogo = (prepId: string, fallback?: string) => {
  return overrides[prepId] ?? fallback ?? ''
}

