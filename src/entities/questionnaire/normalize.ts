import type {
  AnswerOptionClient,
  CodeTaskClient,
  CreateQuestionnaireParamsClient,
  QuestionnaireClient,
  QuestionClient,
  TrainingTaskClient,
} from "./client"
import type {
  AnswerOptionServer,
  CodeTaskServer,
  CreateQuestionnaireRequestServer,
  LegacyQuestionServer,
  QuestionnaireServer,
  QuestionServer,
  TrainingTaskServer,
} from "./server"

const normalizeAnswerOption = (
  answer: AnswerOptionServer,
): AnswerOptionClient => ({
  id: answer.id,
  text: answer.text,
})

const normalizeQuestion = (
  question: QuestionServer | LegacyQuestionServer,
): QuestionClient => ({
  kind: "question",
  id: question.id,
  type: question.type,
  prompt: question.prompt,
  answers: question.answers.map(normalizeAnswerOption),
  correctAnswerId: question.correctAnswerId,
  explanation: question.explanation,
})

const normalizeCodeTask = (task: CodeTaskServer): CodeTaskClient => ({
  kind: "code",
  id: task.id,
  type: task.type,
  title: task.title,
  description: task.description,
  language: task.language,
  fileName: task.fileName,
  starterCode: task.starterCode,
  examples: task.examples.map((example) => ({ ...example })),
  tests: task.tests.map((test) => ({ ...test })),
  hints: [...task.hints],
  solution: { ...task.solution },
})

const normalizeTask = (task: TrainingTaskServer): TrainingTaskClient =>
  task.kind === "code" ? normalizeCodeTask(task) : normalizeQuestion(task)

export const normalizeQuestionnaire = (
  questionnaire: QuestionnaireServer,
): QuestionnaireClient => {
  const tasks =
    "tasks" in questionnaire && questionnaire.tasks
      ? questionnaire.tasks.map(normalizeTask)
      : questionnaire.questions.map(normalizeQuestion)

  return {
    id: questionnaire.id,
    topic: questionnaire.topic,
    topics: [...questionnaire.topics],
    level: questionnaire.level,
    responseFormat: questionnaire.responseFormat,
    total: tasks.length,
    tasks,
  }
}

export const normalizeCreateQuestionnaireRequest = (
  params: CreateQuestionnaireParamsClient,
): CreateQuestionnaireRequestServer => ({
  topics: [...params.topics],
  vacancy: params.vacancy.trim(),
  level: params.level,
  responseFormat: params.responseFormat,
  trainingConfig: {
    theory: { ...params.trainingConfig.theory },
    code: { ...params.trainingConfig.code },
    experience: { ...params.trainingConfig.experience },
    hints: { ...params.trainingConfig.hints },
    attemptsPerTask: params.trainingConfig.attemptsPerTask,
  },
})
