import { serverSupabaseClient } from "#supabase/server"
import { monthDateBounds } from "../utils/month-bounds"
import { requireAuthUserId } from "../utils/require-auth-user"

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const body = await readBody<{ month?: string, amount?: unknown }>(event)
  const monthRaw = typeof body.month === "string" ? body.month : ""
  if (!monthRaw) {
    throw createError({
      statusCode: 400,
      statusMessage: "month é obrigatório (formato YYYY-MM)",
    })
  }
  monthDateBounds(monthRaw)
  const amount = Number(body.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "amount deve ser um número maior que zero",
    })
  }

  const [yStr, mStr] = monthRaw.split("-")
  const year = Number(yStr)
  const monthNum = Number(mStr)

  const client = await serverSupabaseClient(event)

  const { data: existing, error: selErr } = await client
    .from("monthly_goals")
    .select("id")
    .eq("user_id", userId)
    .eq("year", year)
    .eq("month", monthNum)
    .maybeSingle()

  if (selErr) {
    throw createError({
      statusCode: 500,
      statusMessage: selErr.message,
    })
  }

  if (existing) {
    const { error: upErr } = await client
      .from("monthly_goals")
      .update({ amount })
      .eq("id", existing.id)
      .eq("user_id", userId)
    if (upErr) {
      throw createError({
        statusCode: 500,
        statusMessage: upErr.message,
      })
    }
    return { id: existing.id, amount, month: monthRaw }
  }

  const { data: inserted, error: insErr } = await client
    .from("monthly_goals")
    .insert({
      user_id: userId,
      year,
      month: monthNum,
      amount,
    })
    .select("id, amount")
    .single()

  if (insErr) {
    throw createError({
      statusCode: 500,
      statusMessage: insErr.message,
    })
  }

  return {
    id: inserted.id,
    amount: Number(inserted.amount),
    month: monthRaw,
  }
})
