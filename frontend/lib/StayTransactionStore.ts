import create from 'zustand'
import { persist } from 'zustand/middleware'
import { StayRequestApproval } from '/lib/stayTypes'

type StayTransactionState = {
  stayByHash: Record<string, StayRequestApproval>,
  addStay: (stay: StayRequestApproval, hash: string) => void,
}


const useStayTransactionStore = create<StayTransactionState>()(
  persist(
    (set, get) => ({
      stayByHash: {},
      addStay: (stay: StayRequestApproval, hash: string) => set(() => ({ stayByHash: { ...get().stayByHash, [hash]: stay } })),
    }),
    { name: 'stay-hash-store' }
  )
)

export {
  useStayTransactionStore,
}