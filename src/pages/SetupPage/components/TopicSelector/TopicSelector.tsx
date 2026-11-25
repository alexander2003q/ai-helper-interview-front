import clsx from "clsx"
import { observer } from "mobx-react-lite"
import { Button } from "../../../../components/Button"
import { Icon } from "../../../../components/Icon"
import { Input } from "../../../../components/Input"
import type { SetupPageStore } from "../../../../store/locals/SetupPageStore"
import "./TopicSelector.scss"

type TopicSelectorProps = {
  store: SetupPageStore
}

export const TopicSelector = observer(({ store }: TopicSelectorProps) => {
  return (
    <fieldset className="topic-selector">
      <div className="form-label-row">
        <legend>Направление</legend>
        <span className={clsx({ "is-limit": store.isTopicLimitReached })}>
          Можно выбрать до 3 направлений
        </span>
      </div>
      <div className="topic-selector__body">
        <div className="topic-selector__pills">
          {store.visibleTopics.map((topic) => {
            const selected = store.topics.includes(topic)
            const canRemove = selected && !store.isPopularTopic(topic)

            return (
              <Button
                variant="ghost"
                type="button"
                key={topic}
                className={clsx({ "is-selected": selected })}
                aria-pressed={selected}
                icon={canRemove ? <Icon name="close" size={14} /> : undefined}
                onClick={() => store.toggleTopic(topic)}
              >
                {topic}
              </Button>
            )
          })}
          <Button
            variant="ghost"
            type="button"
            className="topic-selector__more"
            aria-expanded={store.isTopicListOpen}
            icon={
              <Icon
                name="chevron-down"
                size={15}
                className={clsx({ "is-rotated": store.isTopicListOpen })}
              />
            }
            onClick={store.toggleTopicList}
          >
            Другие темы
          </Button>
        </div>

        {store.isTopicListOpen && (
          <div className="topic-selector__dropdown">
            <label className="topic-selector__search">
              <Icon name="search" size={17} />
              <Input
                variant="bare"
                value={store.topicSearch}
                onChange={(event) => store.setTopicSearch(event.target.value)}
                placeholder="Найти тему"
                autoFocus
              />
            </label>
            <div className="topic-selector__groups">
              {store.filteredTopicGroups.map((group) => (
                <div key={group.title}>
                  <p>{group.title}</p>
                  <div>
                    {group.topics.map((topic) => (
                      <Button
                        variant="ghost"
                        type="button"
                        key={topic}
                        className={clsx({
                          "is-selected": store.topics.includes(topic),
                        })}
                        disabled={
                          !store.topics.includes(topic) &&
                          store.isTopicLimitReached
                        }
                        onClick={() => store.toggleTopic(topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              {store.filteredTopicGroups.length === 0 && (
                <span className="topic-selector__empty">Ничего не найдено</span>
              )}
            </div>
          </div>
        )}
      </div>
    </fieldset>
  )
})
