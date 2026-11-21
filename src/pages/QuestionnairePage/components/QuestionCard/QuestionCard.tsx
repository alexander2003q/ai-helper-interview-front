import clsx from "clsx"
import type { Question } from "../../../../api/questionnaire"
import { Button } from "../../../../components/Button"
import { Icon } from "../../../../components/Icon"
import "./QuestionCard.scss"

type QuestionCardProps = {
  question: Question
  number: number
  selectedAnswerId: string | null
  isChecked: boolean
  isLast: boolean
  onSelect: (answerId: string) => void
  onCheck: () => void
  onNext: () => void
}

const answerLetters = ["A", "B", "C", "D"]

export const QuestionCard = ({
  question,
  number,
  selectedAnswerId,
  isChecked,
  isLast,
  onSelect,
  onCheck,
  onNext,
}: QuestionCardProps) => {
  const isCorrect = selectedAnswerId === question.correctAnswerId

  return (
    <section className="question-card" aria-labelledby="current-question">
      <div className="question-card__meta">
        <span>Вопрос {number}</span>
        <span>Один правильный ответ</span>
      </div>

      <h2 id="current-question">{question.prompt}</h2>

      <div className="question-card__answers" role="radiogroup">
        {question.answers.map((answer, index) => {
          const isSelected = selectedAnswerId === answer.id
          const isCorrectAnswer = answer.id === question.correctAnswerId
          const isWrongSelected = isChecked && isSelected && !isCorrectAnswer

          return (
            <button
              type="button"
              key={answer.id}
              role="radio"
              aria-checked={isSelected}
              disabled={isChecked}
              className={clsx("question-card__answer", {
                "is-selected": isSelected,
                "is-correct": isChecked && isCorrectAnswer,
                "is-wrong": isWrongSelected,
              })}
              onClick={() => onSelect(answer.id)}
            >
              <span className="question-card__answer-letter">
                {isChecked && isCorrectAnswer ? (
                  <Icon name="check" size={16} />
                ) : (
                  answerLetters[index]
                )}
              </span>
              <span>{answer.text}</span>
            </button>
          )
        })}
      </div>

      {isChecked && (
        <div
          className={clsx("question-card__feedback", {
            "is-correct": isCorrect,
            "is-wrong": !isCorrect,
          })}
          role="status"
        >
          <strong>{isCorrect ? "Верно" : "Не совсем"}</strong>
          <span>{question.explanation}</span>
        </div>
      )}

      <Button
        type="button"
        className="question-card__action"
        disabled={!selectedAnswerId}
        onClick={isChecked ? onNext : onCheck}
      >
        {isChecked
          ? isLast
            ? "Завершить тренировку"
            : "Следующий вопрос"
          : "Проверить ответ"}
      </Button>
    </section>
  )
}
