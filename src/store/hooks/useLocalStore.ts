import { useEffect, useState } from "react"
import type { ILocalStore } from "../interfaces"

export const useLocalStore = <Store extends ILocalStore>(
  creator: () => Store,
) => {
  const [store] = useState(creator)

  useEffect(() => () => store.destroy(), [store])

  return store
}
