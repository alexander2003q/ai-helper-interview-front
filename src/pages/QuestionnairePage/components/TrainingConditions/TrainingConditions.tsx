import clsx from "clsx"
import { Button } from "../../../../components/Button"
import { Icon } from "../../../../components/Icon"
import "./TrainingConditions.scss"

type TrainingConditionsProps = {
  total: number
  format: string
  hints: number
  attempts: number
  isOpen: boolean
  onToggle: () => void
}

export const TrainingConditions = ({
  total,
  format,
  hints,
  attempts,
  isOpen,
  onToggle,
}: TrainingConditionsProps) => {
  return (
    <div className="training-conditions">
      <Button
        variant="outline"
        type="button"
        className="training-conditions__trigger"
        startIcon={<Icon name="settings" size={15} />}
        icon={
          <Icon
            name="chevron-down"
            size={15}
            className={clsx({ "is-rotated": isOpen })}
          />
        }
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        Условия тренировки
      </Button>
      {isOpen && (
        <dl className="training-conditions__content">
          <div>
            <dt>Заданий</dt>
            <dd>{total}</dd>
          </div>
          <div>
            <dt>Формат</dt>
            <dd>{format}</dd>
          </div>
          <div>
            <dt>Подсказок</dt>
            <dd>{hints} на вопрос</dd>
          </div>
          <div>
            <dt>Попыток</dt>
            <dd>{attempts}</dd>
          </div>
        </dl>
      )}
    </div>
  )
}
