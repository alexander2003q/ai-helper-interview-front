import type { PropsWithChildren } from "react"
import type { RootStoreType } from "./RootStore"
import { RootStoreContext } from "./RootStoreContext"

type RootStoreProviderProps = PropsWithChildren<{
  store: RootStoreType
}>

export const RootStoreProvider = ({
  store,
  children,
}: RootStoreProviderProps) => (
  <RootStoreContext.Provider value={store}>
    {children}
  </RootStoreContext.Provider>
)
