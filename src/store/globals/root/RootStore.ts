import { ApiStore } from "../api"
import { TrainingSessionStore } from "../trainingSession"

export class RootStore {
  readonly apiStore = new ApiStore()
  readonly trainingSessionStore = new TrainingSessionStore()
}

export type RootStoreType = RootStore
