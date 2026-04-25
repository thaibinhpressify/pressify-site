export type ConsentState = {
  necessary: boolean
  functional: boolean
  performance: boolean
  targeting: boolean
}

const defaultState: ConsentState = {
  necessary: true,
  functional: true,
  performance: true,
  targeting: true
}

export const useCookieConsent = () => {
  const consent = useCookie<ConsentState>('cookie_consent', {
    default: () => defaultState,
    sameSite: 'lax'
  })

  const isOpen = useState('cookie-modal', () => false)

  const open = () => {
    if (!consent.value) isOpen.value = true
  }

  const acceptAll = () => {
    consent.value = { ...defaultState }
    isOpen.value = false
  }

  const rejectAll = () => {
    consent.value = {
      necessary: true,
      functional: false,
      performance: false,
      targeting: false
    }
    isOpen.value = false
  }

  const save = (data: ConsentState) => {
    consent.value = data
    isOpen.value = false
  }

  return {
    consent,
    isOpen,
    open,
    acceptAll,
    rejectAll,
    save
  }
}