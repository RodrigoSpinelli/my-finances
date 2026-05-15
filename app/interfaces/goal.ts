/** Resumo da categoria para metas vindas da API com join (ícone/color como na store). */
export interface GoalCategoryBrief {
  id: string
  name: string
  icon: string
  color: string | null
}

export interface MonthlyGoalItem {
  id: string
  amount: number
  category_id: string | null
  category: GoalCategoryBrief | null
  spent: number
}

export interface GoalPayload {
  month: string
  goals: MonthlyGoalItem[]
}

export type GoalFormIntentCreate = {
  kind: "create"
  allowGeneral: boolean
  takenCategoryIds: string[]
}

export type GoalFormIntentEdit = {
  kind: "edit"
  goalId: string
  amount: number
  category_id: string | null
  categoryLabel: string
}

export type GoalFormIntent = GoalFormIntentCreate | GoalFormIntentEdit
