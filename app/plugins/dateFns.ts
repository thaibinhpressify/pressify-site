import { $dateFns } from '~/composables/dateFns'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dateFns: $dateFns
    }
  }
})