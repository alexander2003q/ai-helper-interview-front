import type {
  AnswerOptionClient,
  CreateQuestionnaireParamsClient,
  QuestionnaireClient,
  QuestionClient,
} from "./client"
import type {
  AnswerOptionServer,
  CreateQuestionnaireRequestServer,
  QuestionnaireServer,
  QuestionServer,
} from "./server"

const normalizeAnswerOption = (
  answer: AnswerOptionServer,
): AnswerOptionClient => ({
  id: answer.id,
  text: answer.text,
})

const normalizeQuestion = (question: QuestionServer): QuestionClient => ({
  id: question.id,
  type: question.type,
  prompt: question.prompt,
  answers: question.answers.map(normalizeAnswerOption),
  correctAnswerId: question.correctAnswerId,
  explanation: question.explanation,
})

export const normalizeQuestionnaire = (
  questionnaire: QuestionnaireServer,
): QuestionnaireClient => ({
  id: questionnaire.id,
  topic: questionnaire.topic,
  topics: [...questionnaire.topics],
  level: questionnaire.level,
  responseFormat: questionnaire.responseFormat,
  total: questionnaire.total,
  questions: questionnaire.questions.map(normalizeQuestion),
})

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
