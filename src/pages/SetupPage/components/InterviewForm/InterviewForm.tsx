import { observer } from "mobx-react-lite"
import type { FormEvent } from "react"
import { Button } from "../../../../components/Button"
import { Icon } from "../../../../components/Icon"
import { SegmentedControl } from "../../../../components/SegmentedControl"
import { Textarea } from "../../../../components/Textarea"
import type { SetupPageStore } from "../../../../store/locals/SetupPageStore"
import { TopicSelector } from "../TopicSelector"
import { TrainingSettings } from "../TrainingSettings"
import "./InterviewForm.scss"

const levels = [
  { value: "junior", label: "Junior" },
  { value: "middle", label: "Middle" },
  { value: "senior", label: "Senior" },
] as const

const modes = [
  {
    value: "text",
    label: "Текст",
    icon: <Icon name="message" size={16} />,
  },
  {
    value: "voice",
    label: "Голос",
    icon: <Icon name="microphone" size={16} />,
  },
] as const

type InterviewFormProps = {
  store: SetupPageStore
  onStart: () => void
}

export const InterviewForm = observer(
  ({ store, onStart }: InterviewFormProps) => {
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (await store.createQuestionnaire()) onStart()
    }

    return (
      <section className="interview-card" aria-labelledby="interview-title">
        <div className="interview-card__accent" aria-hidden="true" />
        <form className="interview-card__surface" onSubmit={handleSubmit}>
          <div className="interview-card__heading">
            <p>Новая тренировка</p>
            <h2 id="interview-title">Настройте интервью</h2>
          </div>

          <div className="interview-card__fields">
            <TopicSelector store={store} />

            <div className="vacancy-field">
              <div className="form-label-row">
                <label htmlFor="vacancy">Требования вакансии</label>
                <span>Необязательно</span>
              </div>
              <Textarea
                id="vacancy"
                value={store.vacancy}
                onChange={(event) => store.setVacancy(event.target.value)}
                placeholder="Вставьте описание вакансии или ключевые требования..."
              />
              <p>
                <Icon name="sparkles" size={14} />
                Подстроим вопросы под стек и задачи компании
              </p>
            </div>

            <div className="interview-card__segments">
              <fieldset>
                <legend>Уровень</legend>
                <SegmentedControl
                  value={store.level}
                  options={[...levels]}
                  onChange={store.setLevel}
                  ariaLabel="Уровень специалиста"
                />
              </fieldset>
              <fieldset>
                <legend>Формат ответа</legend>
                <SegmentedControl
                  value={store.responseFormat}
                  options={[...modes]}
                  onChange={store.setResponseFormat}
                  ariaLabel="Формат ответа"
                />
              </fieldset>
            </div>

            <TrainingSettings store={store} />

            <Button
              type="submit"
              className="interview-card__submit"
              disabled={!store.canSubmit}
              aria-busy={store.isSubmitting}
              icon={
                <span className="interview-card__submit-icon">
                  <Icon name="chevron-right" size={20} />
                </span>
              }
            >
              <span className="interview-card__submit-label">
                <Icon name="sparkles" size={20} />
                {store.isSubmitting
                  ? "Генерируем вопросы..."
                  : "Создать тренировку"}
              </span>
            </Button>

            {store.error && (
              <div className="interview-card__error" role="alert">
                {store.error}
              </div>
            )}
          </div>
        </form>
      </section>
    )
  },
)
