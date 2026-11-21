import clsx from "clsx"
import { Button } from "../Button"
import { Icon } from "../Icon"
import "./Stepper.scss"

type StepperProps = {
  value: number
  min: number
  max: number
  disabled?: boolean
  onChange: (value: number) => void
}

export const Stepper = ({
  value,
  min,
  max,
  disabled = false,
  onChange,
}: StepperProps) => (
  <div className={clsx("stepper", { "is-disabled": disabled })}>
    <Button
      variant="ghost"
      type="button"
      aria-label="Уменьшить"
      disabled={disabled || value <= min}
      onClick={() => onChange(value - 1)}
    >
      <Icon name="minus" size={14} />
    </Button>
    <span>{value}</span>
    <Button
      variant="ghost"
      type="button"
      aria-label="Увеличить"
      disabled={disabled || value >= max}
      onClick={() => onChange(value + 1)}
    >
      <Icon name="plus" size={14} />
    </Button>
  </div>
)
