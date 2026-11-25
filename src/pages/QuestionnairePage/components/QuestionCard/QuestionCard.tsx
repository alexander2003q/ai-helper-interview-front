import clsx from "clsx"
import { Button } from "../../../../components/Button"
import { Icon } from "../../../../components/Icon"
import type { QuestionClient } from "../../../../entities/questionnaire"
import "./QuestionCard.scss"

type QuestionCardProps = {
  question: QuestionClient
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
  const selectedAnswer = question.answers.find(
    (answer) => answer.id === selectedAnswerId,
  )
  const correctAnswer = question.answers.find(
    (answer) => answer.id === question.correctAnswerId,
  )

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

      {isChecked && isCorrect && (
        <div className="question-card__feedback is-correct" role="status">
          <strong>Верно</strong>
          <span>{question.explanation}</span>
        </div>
      )}

      {isChecked && !isCorrect && (
        <div className="question-card__review" role="status">
          <article className="question-card__review-card is-correct">
            <span>Правильный ответ</span>
            <strong>{correctAnswer?.text}</strong>
            <p>{question.explanation}</p>
          </article>
          <article className="question-card__review-card is-wrong">
            <span>Почему ваш вариант неверен</span>
            <p>
              {selectedAnswer?.explanation ??
                "Этот вариант не соответствует условию вопроса."}
            </p>
          </article>
        </div>
      )}

      <Button
        type="button"
        className="question-card__action"
        disabled={!selectedAnswerId}
        icon={
          isChecked && !isLast ? (
            <Icon name="chevron-right" size={16} />
          ) : undefined
        }
        onClick={isChecked ? onNext : onCheck}
      >
        {isChecked
          ? isLast
            ? "Завершить тренировку"
            : "Следующее задание"
          : "Проверить ответ"}
      </Button>
    </section>
  )
}
