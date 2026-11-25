import { Header } from "../../components/Header"
import { useRootStore } from "../../store/globals/root"
import { useLocalStore } from "../../store/hooks"
import { SetupPageStore } from "../../store/locals/SetupPageStore"
import { Hero } from "./components/Hero"
import { InterviewForm } from "./components/InterviewForm"
import "./SetupPage.scss"

type SetupPageProps = {
  onStart: () => void
}

export const SetupPage = ({ onStart }: SetupPageProps) => {
  const rootStore = useRootStore()
  const store = useLocalStore(() => new SetupPageStore({ rootStore }))

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
