import { observer } from "mobx-react-lite"
import { lazy, Suspense } from "react"
import { Header } from "../../components/Header"
import { useRootStore } from "../../store/globals/root"
import { useLocalStore } from "../../store/hooks"
import { QuestionnairePageStore } from "../../store/locals/QuestionnairePageStore"
import { QuestionCard } from "./components/QuestionCard"
import { TrainingConditions } from "./components/TrainingConditions"
import { TrainingProgress } from "./components/TrainingProgress"
import "./QuestionnairePage.scss"

// CodeMirror is intentionally loaded only when the code task opens.
// eslint-disable-next-line react-refresh/only-export-components
const CodeTaskCard = lazy(() =>
  import("./components/CodeTaskCard").then(({ CodeTaskCard }) => ({
    default: CodeTaskCard,
  })),
)

type QuestionnairePageProps = {
  onExit: () => void
}

export const QuestionnairePage = observer(
  ({ onExit }: QuestionnairePageProps) => {
    const rootStore = useRootStore()
    const store = useLocalStore(() => new QuestionnairePageStore({ rootStore }))
    const questionnaire = store.questionnaire
    const task = store.currentTask
    const question = store.currentQuestion
    const codeTask = store.currentCodeTask

    const handleNext = () => {
      if (!store.nextTask()) {
        onExit()
        return
      }
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    if (!questionnaire || !task) {
      return null
    }

    const { topic, level } = questionnaire
    const conditions = rootStore.trainingSessionStore.conditions

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
              <p>{task.type}</p>
              <h1>
                {topic} <span>·</span> {level}
              </h1>
            </div>
            <div className="questionnaire-page__status">
              <TrainingProgress
                current={store.currentNumber}
                total={store.totalTasks}
              />
              <TrainingConditions
                total={store.totalTasks}
                format={conditions.format}
                hints={conditions.hints}
                attempts={conditions.attempts}
                isOpen={store.isConditionsOpen}
                onToggle={store.toggleConditions}
              />
            </div>
          </section>

          {codeTask ? (
            <Suspense
              fallback={
                <div className="questionnaire-page__code-loading">
                  Загружаем редактор…
                </div>
              }
            >
              <CodeTaskCard
                task={codeTask}
                store={store}
                isLast={store.isLastTask}
                onNext={handleNext}
              />
            </Suspense>
          ) : (
            question && (
              <QuestionCard
                question={question}
                number={store.currentNumber}
                selectedAnswerId={store.selectedAnswerId}
                isChecked={store.isChecked}
                isLast={store.isLastTask}
                onSelect={store.selectAnswer}
                onCheck={store.checkAnswer}
                onNext={handleNext}
              />
            )
          )}
        </main>
      </div>
    )
  },
)
