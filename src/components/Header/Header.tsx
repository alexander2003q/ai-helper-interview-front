import clsx from "clsx"
import { Button } from "../Button"
import { Icon } from "../Icon"
import "./Header.scss"

type HeaderProps = {
  theme?: "light" | "dark"
  caption?: string
  actionLabel?: string
  onAction?: () => void
  onBrandClick?: () => void
}

export const Header = ({
  theme = "light",
  caption = "Создание тренировки",
  actionLabel = "Войти",
  onAction,
  onBrandClick,
}: HeaderProps) => {
  return (
    <header className={clsx("header", `header--${theme}`)}>
      <div className="header__inner">
        <Button
          variant="ghost"
          type="button"
          className="header__brand"
          onClick={onBrandClick}
          aria-label="Интервью — на главную"
        >
          <span className="header__logo">
            <Icon name="sparkles" size={21} />
          </span>
          <span className="header__brand-name">
            интервью<span>.</span>
          </span>
        </Button>
        <span className="header__caption">{caption}</span>
        <Button variant="outline" className="header__login" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </header>
  )
}
