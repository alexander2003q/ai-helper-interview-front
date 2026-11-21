import { observer } from "mobx-react-lite"
import { useState } from "react"
import { Header } from "../../components/Header"
import { QuestionnairePageStore } from "../../store/QuestionnairePageStore"
import { useRootStore } from "../../store/RootStore"
import { QuestionCard } from "./components/QuestionCard"
import { TrainingConditions } from "./components/TrainingConditions"
import { TrainingProgress } from "./components/TrainingProgress"
import "./QuestionnairePage.scss"

type QuestionnairePageProps = {
  onExit: () => void
}

export const QuestionnairePage = observer(
  ({ onExit }: QuestionnairePageProps) => {
    const { trainingSessionStore } = useRootStore()
    const [store] = useState(
      () => new QuestionnairePageStore(trainingSessionStore),
    )
    const questionnaire = store.questionnaire
    const question = store.currentQuestion

    const handleNext = () => {
      if (!store.nextQuestion()) {
        onExit()
        return
      }
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    if (!questionnaire || !question) return null

    const { topic, level, questions } = questionnaire
    const conditions = trainingSessionStore.conditions

    return (
      <div className="questionnaire-page">
        <Header
          theme="dark"
          caption="Тренировка в процессе"
          actionLabel="Выйти"
          onAction={onExit}
          onBrandClick={onExit}
        />

        <main className="questionnaire-page__content">
          <section className="questionnaire-page__overview">
            <div className="questionnaire-page__title">
              <p>{question.type}</p>
              <h1>
                {topic} <span>·</span> {level}
              </h1>
            </div>
            <div className="questionnaire-page__status">
              <TrainingProgress
                current={store.currentNumber}
                total={questions.length}
              />
              <TrainingConditions
                total={questions.length}
                format={conditions.format}
                hints={conditions.hints}
                attempts={conditions.attempts}
                isOpen={store.isConditionsOpen}
                onToggle={store.toggleConditions}
              />
            </div>
          </section>

          <QuestionCard
            question={question}
            number={store.currentNumber}
            selectedAnswerId={store.selectedAnswerId}
            isChecked={store.isChecked}
            isLast={store.isLastQuestion}
            onSelect={store.selectAnswer}
            onCheck={store.checkAnswer}
            onNext={handleNext}
          />
        </main>
      </div>
    )
  },
)
