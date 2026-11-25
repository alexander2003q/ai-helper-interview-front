import { useContext } from "react"
import { RootStoreContext } from "./RootStoreContext"

export const useRootStore = () => {
  const store = useContext(RootStoreContext)
  if (!store) throw new Error("RootStoreProvider is missing")
  return store
}
