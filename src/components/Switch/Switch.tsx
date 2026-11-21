import clsx from "clsx"
import type { ButtonHTMLAttributes } from "react"
import "./Switch.scss"

type SwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "role" | "aria-checked" | "onChange"
> & {
  checked: boolean
  onChange: (checked: boolean) => void
}

export const Switch = ({
  checked,
  onChange,
  className,
  ...props
}: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    className={clsx("switch", { "is-on": checked }, className)}
    onClick={() => onChange(!checked)}
    {...props}
  >
    <span />
  </button>
)
