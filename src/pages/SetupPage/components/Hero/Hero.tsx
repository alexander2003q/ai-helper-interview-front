import "./Hero.scss"

const steps = ["Добавьте вакансию", "Пройдите интервью", "Разберите ошибки"]

export const Hero = () => (
  <section className="hero">
    <div>
      <div className="hero__badge">
        <span />
        AI-тренажёр собеседований
      </div>
      <h1 className="hero__title">
        Потренируйся
        <br />
        до{" "}
        <span>
          оффера
          <i aria-hidden="true" />
        </span>
      </h1>
      <p className="hero__description">
        Собеседование под вашу вакансию: живые вопросы, микро-задачи и честный
        фидбек по каждому ответу.
      </p>
    </div>
    <div className="hero__steps">
      {steps.map((step, index) => (
        <div className="hero__step" key={step}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>{step}</p>
        </div>
      ))}
    </div>
  </section>
)
