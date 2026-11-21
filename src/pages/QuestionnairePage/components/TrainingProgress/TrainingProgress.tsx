import "./TrainingProgress.scss"

type TrainingProgressProps = {
  current: number
  total: number
}

export const TrainingProgress = ({ current, total }: TrainingProgressProps) => {
  const progress = Math.round((current / total) * 100)

  return (
    <div
      className="training-progress"
      aria-label={`Задание ${current} из ${total}`}
    >
      <div className="training-progress__meta">
        <span>
          Задание <strong>{current}</strong> из {total}
        </span>
        <span>{progress}%</span>
      </div>
      <div
        className="training-progress__track"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
