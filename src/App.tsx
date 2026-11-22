import { observer } from "mobx-react-lite"
import { useState } from "react"
import { QuestionnairePage } from "./pages/QuestionnairePage"
import { SetupPage } from "./pages/SetupPage"
import { useRootStore } from "./store/globals/root"

const App = observer(() => {
  const [page, setPage] = useState<"setup" | "questionnaire">("setup")
  const { trainingSessionStore } = useRootStore()

  const openPage = (nextPage: "setup" | "questionnaire") => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const exitQuestionnaire = () => {
    trainingSessionStore.reset()
    openPage("setup")
  }

  if (page === "questionnaire" && trainingSessionStore.hasQuestionnaire) {
    return <QuestionnairePage onExit={exitQuestionnaire} />
  }

  return <SetupPage onStart={() => openPage("questionnaire")} />
})

export default App
