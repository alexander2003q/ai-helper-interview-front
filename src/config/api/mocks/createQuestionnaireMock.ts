import type {
  CodeTaskServer,
  CreateQuestionnaireRequestServer,
  QuestionnaireServer,
  QuestionServer,
} from "../../../entities/questionnaire"
import type { LevelLabel } from "../../../entities/questionnaire"
import type { ApiMockResponse } from "../../../store/models/ApiRequest"

const levelLabels: Record<
  CreateQuestionnaireRequestServer["level"],
  LevelLabel
> = {
  junior: "Junior",
  middle: "Middle",
  senior: "Senior",
}

const theoryTemplates: Array<Omit<QuestionServer, "id">> = [
  {
    kind: "question",
    type: "Теоретический вопрос",
    prompt:
      "Что произойдёт при обновлении state внутри useEffect без массива зависимостей?",
    answers: [
      {
        id: "a",
        text: "Эффект выполнится только один раз",
        explanation:
          "Без массива зависимостей React не ограничивает число запусков эффекта. Один раз он сработал бы с пустым массивом [].",
      },
      { id: "b", text: "Возникнет цикл перерендеров" },
      {
        id: "c",
        text: "React проигнорирует setState",
        explanation:
          "React применяет setState и внутри эффекта. Обновление не игнорируется, а планирует следующий рендер.",
      },
      {
        id: "d",
        text: "Компонент сразу размонтируется",
        explanation:
          "Обновление state не размонтирует компонент. Оно только запускает новый рендер, после которого эффект срабатывает снова.",
      },
    ],
    correctAnswerId: "b",
    explanation:
      "Эффект запускается после каждого рендера, а setState инициирует следующий рендер.",
  },
  {
    kind: "question",
    type: "Теоретический вопрос",
    prompt: "Для чего React использует свойство key при рендере списка?",
    answers: [
      {
        id: "a",
        text: "Для стилизации элементов списка",
        explanation:
          "key не участвует в стилях. Это служебный идентификатор, по которому React сопоставляет элементы между рендерами.",
      },
      {
        id: "b",
        text: "Для сортировки данных по алфавиту",
        explanation:
          "key не сортирует данные. Порядок задаёт сам массив, а key только отличает элементы друг от друга.",
      },
      { id: "c", text: "Для сопоставления элементов между рендерами" },
      {
        id: "d",
        text: "Для передачи значения в props",
        explanation:
          "key не попадает в props компонента. Данные элемента нужно передавать отдельным свойством.",
      },
    ],
    correctAnswerId: "c",
    explanation:
      "Стабильный key помогает React понять, какой элемент изменился, добавился или был удалён.",
  },
  {
    kind: "question",
    type: "Теоретический вопрос",
    prompt: "Когда имеет смысл использовать useMemo?",
    answers: [
      {
        id: "a",
        text: "Для каждого вычисления в компоненте",
        explanation:
          "Оборачивать каждое вычисление в useMemo не нужно: сравнение зависимостей само занимает время.",
      },
      { id: "b", text: "Для кэширования дорогого вычисления" },
      {
        id: "c",
        text: "Для выполнения сетевого запроса",
        explanation:
          "Сетевой запрос — это побочный эффект. useMemo только запоминает результат вычисления.",
      },
      {
        id: "d",
        text: "Для замены локального state",
        explanation:
          "useMemo не хранит состояние, которое меняет пользователь. Для этого нужен useState.",
      },
    ],
    correctAnswerId: "b",
    explanation:
      "useMemo полезен, когда повторное вычисление действительно дорого и зависимости меняются нечасто.",
  },
]

const codeHintPool = [
  "Объект Set хранит только уникальные значения.",
  "Set можно превратить обратно в массив через spread.",
  "Порядок первого вхождения Set сохраняет сам.",
]

const createCodeTask = (id: number, hintCount: number): CodeTaskServer => ({
  kind: "code",
  id,
  type: "Микро-задача с кодом",
  title: "Уникальные значения массива",
  description:
    "Напишите функцию uniqueValues, которая принимает массив и возвращает новый массив без повторяющихся значений, сохраняя исходный порядок.",
  language: "javascript",
  fileName: "solution.js",
  starterCode: `function uniqueValues(items) {
  // Напишите решение

}`,
  examples: [{ input: "[1, 2, 2, 3]", output: "[1, 2, 3]" }],
  tests: [
    { id: "array", title: "Обычный массив" },
    { id: "strings", title: "Дубликаты строк" },
    { id: "empty", title: "Пустой массив" },
    { id: "mixed", title: "Смешанные типы" },
  ],
  hints: codeHintPool.slice(0, hintCount),
  solution: {
    code: "return [...new Set(items)]",
    explanation:
      "Set удаляет дубликаты за O(n), а spread-оператор преобразует коллекцию обратно в массив.",
  },
})

export const createQuestionnaireMock: ApiMockResponse<
  QuestionnaireServer,
  CreateQuestionnaireRequestServer
> = ({ data }) => {
  if (!data) throw new Error("Questionnaire mock requires request data")

  const theoryCount = data.trainingConfig.theory.enabled
    ? data.trainingConfig.theory.count
    : 0
  const codeCount = data.trainingConfig.code.enabled
    ? data.trainingConfig.code.count
    : 0
  const hintCount = data.trainingConfig.hints.enabled
    ? data.trainingConfig.hints.perTask
    : 0

  const questions = Array.from({ length: theoryCount }, (_, index) => ({
    ...theoryTemplates[index % theoryTemplates.length],
    id: index + 1,
  }))
  const codeTasks = Array.from({ length: codeCount }, (_, index) =>
    createCodeTask(theoryCount + index + 1, hintCount),
  )
  const tasks = [...questions, ...codeTasks]

  return {
    id: `questionnaire-mock-${Date.now()}`,
    topic: data.topics[0],
    topics: [...data.topics],
    level: levelLabels[data.level],
    responseFormat: data.responseFormat,
    total: tasks.length,
    hints: {
      enabled: data.trainingConfig.hints.enabled,
      perTask: hintCount,
    },
    attemptsPerTask: data.trainingConfig.attemptsPerTask,
    tasks,
  }
}
