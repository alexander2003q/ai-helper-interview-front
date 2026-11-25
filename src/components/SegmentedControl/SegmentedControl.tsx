import clsx from "clsx"
import type { ReactNode } from "react"
import { Button } from "../Button"
import "./SegmentedControl.scss"

export type Segment<T extends string> = {
  value: T
  label: string
  icon?: ReactNode
}

type SegmentedControlProps<T extends string> = {
  value: T
  options: Segment<T>[]
  onChange: (value: T) => void
  ariaLabel: string
}

export const SegmentedControl = <T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) => {
  return (
    <div className="segmented-control" role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <Button
          variant="ghost"
          type="button"
          key={option.value}
          className={clsx({ "is-active": value === option.value })}
          startIcon={option.icon}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
