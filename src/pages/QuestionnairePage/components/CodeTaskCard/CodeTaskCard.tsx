import { javascript } from "@codemirror/lang-javascript"
import { oneDark } from "@codemirror/theme-one-dark"
import CodeMirror from "@uiw/react-codemirror"
import clsx from "clsx"
import { observer } from "mobx-react-lite"
import { Button } from "../../../../components/Button"
import { Icon } from "../../../../components/Icon"
import type { CodeTaskClient } from "../../../../entities/questionnaire"
import type { QuestionnairePageStore } from "../../../../store/locals/QuestionnairePageStore"
import "./CodeTaskCard.scss"

type CodeTaskCardProps = {
  task: CodeTaskClient
  store: QuestionnairePageStore
  isLast: boolean
  onNext: () => void
}

export const CodeTaskCard = observer(function CodeTaskCard({
  task,
  store,
  isLast,
  onNext,
}: CodeTaskCardProps) {
  const isFinished = store.codeTestState === "success" || store.attemptsEnded
  const passedOnFailure = Math.ceil(task.tests.length / 2)

  return (
    <section className="code-task" aria-labelledby="current-code-task">
      <header className="code-task__header">
        <div>
          <span>Задача {store.currentNumber}</span>
          <h2 id="current-code-task">{task.title}</h2>
        </div>
        <div className="code-task__badges">
          <span>
            Попытка {Math.min(store.codeAttempt, store.maxAttempts)} из{" "}
            {store.maxAttempts}
          </span>
          {store.hintsEnabled && (
            <span>Доступно подсказок: {store.codeHintsLeft}</span>
          )}
        </div>
      </header>

      <div className="code-task__body">
        <aside className="code-task__description">
          <h3>Условие</h3>
          <p>{task.description}</p>
          {task.examples.map((example, index) => (
            <pre
              key={`${example.input}-${index}`}
              aria-label={`Пример ${index + 1}`}
            >
              <span>input</span> {example.input}
              {"\n"}
              <span>output</span> {example.output}
            </pre>
          ))}

          {task.hints.slice(0, store.revealedCodeHints).map((hint, index) => (
            <div className="code-task__hint" role="status" key={hint}>
              <strong>
                <Icon name="bulb" size={15} />
                Подсказка {index + 1}
              </strong>
              <p>{hint}</p>
            </div>
          ))}

          {store.hintsEnabled && (
            <Button
              type="button"
              variant="outline"
              className="code-task__hint-button"
              startIcon={<Icon name="bulb" size={16} />}
              disabled={
                store.codeHintsLeft === 0 || store.codeTestState === "success"
              }
              onClick={store.showCodeHint}
            >
              Получить подсказку
            </Button>
          )}
        </aside>

        <div className="code-task__workspace">
          <div className="code-task__editor-heading">
            <h3>Редактор кода</h3>
            <span>
              {task.language === "typescript" ? "TypeScript" : "JavaScript"}
            </span>
          </div>
          <div className="code-task__editor">
            <div className="code-task__filename">{task.fileName}</div>
            <CodeMirror
              value={store.code}
              height="270px"
              theme={oneDark}
              extensions={[
                javascript({ typescript: task.language === "typescript" }),
              ]}
              editable={!isFinished}
              basicSetup={{
                foldGutter: false,
                highlightActiveLine: false,
                highlightActiveLineGutter: false,
              }}
              onChange={store.setCode}
              aria-label="Редактор решения на JavaScript"
            />
          </div>

          {store.codeTestState !== "idle" && (
            <div
              className={clsx("code-task__tests", {
                "is-success": store.codeTestState === "success",
              })}
              role="status"
            >
              <div className="code-task__tests-heading">
                <strong>
                  {store.codeTestState === "success"
                    ? "Все тесты пройдены"
                    : store.attemptsEnded
                      ? "Задача не решена"
                      : "Есть ошибки — попробуйте ещё"}
                </strong>
                <span>
                  {store.codeTestState === "success"
                    ? task.tests.length
                    : passedOnFailure}
                  /{task.tests.length}
                </span>
              </div>
              <div className="code-task__test-list">
                {task.tests.map((test, index) => {
                  const passed =
                    store.codeTestState === "success" || index < passedOnFailure

                  return (
                    <div key={test.id}>
                      <span className={clsx({ "is-failed": !passed })}>
                        {passed ? <Icon name="check" size={11} /> : "×"}
                      </span>
                      {test.title}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {store.attemptsEnded && (
            <div className="code-task__solution">
              <strong>Правильное решение</strong>
              <code>{task.solution.code}</code>
              <p>{task.solution.explanation}</p>
            </div>
          )}

          <Button
            type="button"
            className="code-task__action"
            startIcon={!isFinished && <Icon name="play" size={16} />}
            onClick={isFinished ? onNext : store.runCodeTests}
          >
            {isFinished
              ? isLast
                ? "Завершить тренировку"
                : "Следующее задание"
              : "Запустить тесты"}
          </Button>
        </div>
      </div>
    </section>
  )
})
