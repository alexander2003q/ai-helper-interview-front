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
      { id: "a", text: "Эффект выполнится только один раз" },
      { id: "b", text: "Возникнет цикл перерендеров" },
      { id: "c", text: "React проигнорирует setState" },
      { id: "d", text: "Компонент сразу размонтируется" },
    ],
    correctAnswerId: "b",
    explanation:
      "Эффект запускается после каждого рендера, а обновление state вызывает следующий рендер.",
  },
  {
    kind: "question",
    type: "Теоретический вопрос",
    prompt: "Для чего React использует свойство key при рендере списка?",
    answers: [
      { id: "a", text: "Для стилизации элементов списка" },
      { id: "b", text: "Для сортировки данных по алфавиту" },
      { id: "c", text: "Для сопоставления элементов между рендерами" },
      { id: "d", text: "Для передачи значения в props" },
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
      { id: "a", text: "Для каждого вычисления в компоненте" },
      { id: "b", text: "Для кэширования дорогого вычисления" },
      { id: "c", text: "Для выполнения сетевого запроса" },
      { id: "d", text: "Для замены локального state" },
    ],
    correctAnswerId: "b",
    explanation:
      "useMemo полезен, когда повторное вычисление действительно дорого и зависимости меняются нечасто.",
  },
]

const createCodeTask = (id: number): CodeTaskServer => ({
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
  hints: [
    "Объект Set хранит только уникальные значения. Его можно превратить обратно в массив.",
    "Попробуйте объединить new Set(items) со spread-оператором внутри квадратных скобок.",
  ],
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

  const questions = Array.from({ length: theoryCount }, (_, index) => ({
    ...theoryTemplates[index % theoryTemplates.length],
    id: codeCount + index + 1,
  }))
  const codeTasks = Array.from({ length: codeCount }, (_, index) =>
    createCodeTask(index + 1),
  )
  const tasks = [...codeTasks, ...questions]

  return {
    id: `questionnaire-mock-${Date.now()}`,
    topic: data.topics[0],
    topics: [...data.topics],
    level: levelLabels[data.level],
    responseFormat: data.responseFormat,
    total: tasks.length,
    tasks,
  }
}
