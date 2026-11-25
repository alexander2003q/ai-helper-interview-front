import clsx from "clsx"
import { observer } from "mobx-react-lite"
import { Button } from "../../../../components/Button"
import { Checkbox } from "../../../../components/Checkbox"
import { Icon } from "../../../../components/Icon"
import { Stepper } from "../../../../components/Stepper"
import { Switch } from "../../../../components/Switch"
import type {
  SetupPageStore,
  TrainingSectionKey,
} from "../../../../store/locals/SetupPageStore"
import "./TrainingSettings.scss"

type CounterRow = {
  key: TrainingSectionKey
  label: string
  min: number
  max: number
}

const rows: CounterRow[] = [
  { key: "theory", label: "Теоретические вопросы", min: 1, max: 20 },
  { key: "code", label: "Микро-задачи с кодом", min: 1, max: 10 },
]

type TrainingSettingsProps = {
  store: SetupPageStore
}

export const TrainingSettings = observer(({ store }: TrainingSettingsProps) => {
  const { trainingSummary } = store

  return (
    <div className="training-settings">
      <Button
        variant="ghost"
        type="button"
        className="training-settings__header"
        aria-expanded={store.isSettingsOpen}
        onClick={store.toggleSettings}
      >
        <span className="training-settings__title">
          <span>
            <Icon name="settings" size={16} />
          </span>
          Настроить тренировку
        </span>
        <span className="training-settings__summary">
          {trainingSummary.tasks} заданий · ≈ {trainingSummary.minutes} мин
          <Icon
            name="chevron-down"
            size={17}
            className={clsx({ "is-rotated": store.isSettingsOpen })}
          />
        </span>
      </Button>
      {store.isSettingsOpen && (
        <div className="training-settings__content">
          <h3>Состав тренировки</h3>
          <div className="training-settings__rows">
            {rows.map((row) => {
              const section = store.trainingConfig[row.key]
              return (
                <div className="training-settings__row" key={row.label}>
                  <label>
                    <Checkbox
                      checked={section.enabled}
                      onChange={(event) =>
                        store.setSectionEnabled(row.key, event.target.checked)
                      }
                    />
                    {row.label}
                  </label>
                  <Stepper
                    value={section.count}
                    min={row.min}
                    max={row.max}
                    disabled={!section.enabled}
                    onChange={(count) => store.setSectionCount(row.key, count)}
                  />
                </div>
              )
            })}
          </div>
          <div className="training-settings__options">
            <div className="toggle-row">
              <span>Разрешить подсказки</span>
              <Switch
                checked={store.trainingConfig.hints.enabled}
                onChange={store.setHintsEnabled}
              />
            </div>
            {store.trainingConfig.hints.enabled && (
              <div className="training-settings__hint-count">
                <span>Количество подсказок на задачу</span>
                <Stepper
                  value={store.trainingConfig.hints.perTask}
                  min={1}
                  max={3}
                  onChange={store.setHintsPerTask}
                />
              </div>
            )}
            <div className="toggle-row">
              <span>Количество попыток на задачу</span>
              <Stepper
                value={store.trainingConfig.attemptsPerTask}
                min={1}
                max={5}
                onChange={store.setAttemptsPerTask}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
