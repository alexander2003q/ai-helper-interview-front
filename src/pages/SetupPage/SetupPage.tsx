import { useState } from "react"
import { Header } from "../../components/Header"
import { SetupPageStore } from "../../store/SetupPageStore"
import { useRootStore } from "../../store/RootStore"
import { Hero } from "./components/Hero"
import { InterviewForm } from "./components/InterviewForm"
import "./SetupPage.scss"

type SetupPageProps = {
  onStart: () => void
}

export const SetupPage = ({ onStart }: SetupPageProps) => {
  const { trainingSessionStore } = useRootStore()
  const [store] = useState(() => new SetupPageStore(trainingSessionStore))

  return (
    <div id="top" className="setup-page">
      <Header />
      <main className="setup-page__content">
        <Hero />
        <InterviewForm store={store} onStart={onStart} />
      </main>
    </div>
  )
}
