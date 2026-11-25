import clsx from "clsx"
import { useMemo, useState } from "react"
import { Button } from "../../../../components/Button"
import { Icon } from "../../../../components/Icon"
import { Input } from "../../../../components/Input"
import "./TopicSelector.scss"

const popularTopics = [
  "React",
  "Frontend",
  "JavaScript",
  "Python",
  "Product",
  "Data Science",
]

const topicGroups = {
  Разработка: ["Vue", "Angular", "Node.js", "Java", "C#", "Go"],
  Аналитика: ["SQL", "Data Engineering", "Machine Learning"],
  Дизайн: ["UX/UI", "Product Design"],
  Менеджмент: ["QA", "DevOps", "System Design", "Project Management"],
}

type TopicSelectorProps = {
  value: string[]
  onChange: (topics: string[]) => void
}

export const TopicSelector = ({ value, onChange }: TopicSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  const groups = useMemo(() => {
    const query = search.trim().toLowerCase()
    return Object.entries(topicGroups)
      .map(
        ([group, topics]) =>
          [
            group,
            topics.filter((topic) => topic.toLowerCase().includes(query)),
          ] as const,
      )
      .filter(([, topics]) => topics.length > 0)
  }, [search])

  const toggleTopic = (topic: string) => {
    if (value.includes(topic)) {
      onChange(value.filter((item) => item !== topic))
      return
    }
    if (value.length < 3) onChange([...value, topic])
  }

  const visibleTopics = [
    ...popularTopics,
    ...value.filter((topic) => !popularTopics.includes(topic)),
  ]

  return (
    <fieldset className="topic-selector">
      <div className="form-label-row">
        <legend>Направление</legend>
        <span className={clsx({ "is-limit": value.length === 3 })}>
          Можно выбрать до 3 направлений
        </span>
      </div>
      <div className="topic-selector__body">
        <div className="topic-selector__pills">
          {visibleTopics.map((topic) => {
            const selected = value.includes(topic)
            const canRemove = selected && !popularTopics.includes(topic)

            return (
              <Button
                variant="ghost"
                type="button"
                key={topic}
                className={clsx({ "is-selected": selected })}
                aria-pressed={selected}
                icon={canRemove ? <Icon name="close" size={14} /> : undefined}
                onClick={() => toggleTopic(topic)}
              >
                {topic}
              </Button>
            )
          })}
          <Button
            variant="ghost"
            type="button"
            className="topic-selector__more"
            aria-expanded={isOpen}
            icon={
              <Icon
                name="chevron-down"
                size={15}
                className={clsx({ "is-rotated": isOpen })}
              />
            }
            onClick={() => setIsOpen((current) => !current)}
          >
            Другие темы
          </Button>
        </div>

        {isOpen && (
          <div className="topic-selector__dropdown">
            <label className="topic-selector__search">
              <Icon name="search" size={17} />
              <Input
                variant="bare"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Найти тему"
                autoFocus
              />
            </label>
            <div className="topic-selector__groups">
              {groups.map(([group, topics]) => (
                <div key={group}>
                  <p>{group}</p>
                  <div>
                    {topics.map((topic) => (
                      <Button
                        variant="ghost"
                        type="button"
                        key={topic}
                        className={clsx({
                          "is-selected": value.includes(topic),
                        })}
                        disabled={!value.includes(topic) && value.length >= 3}
                        onClick={() => toggleTopic(topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              {groups.length === 0 && (
                <span className="topic-selector__empty">Ничего не найдено</span>
              )}
            </div>
          </div>
        )}
      </div>
    </fieldset>
  )
}
