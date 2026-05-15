import { serverSupabaseClient } from "#supabase/server"
import type { Database } from "~/types/database.types"
import { monthDateBounds } from "../utils/month-bounds"
import { requireAuthUserId } from "../utils/require-auth-user"

type TxT = Database["public"]["Enums"]["transaction_type"]

function normalizeOptionalCategory(body: Record<string, unknown>): string | null {
  const v = body.category_id
  if (v === null || v === undefined)
    return null
  if (typeof v !== "string")
    throw createError({ statusCode: 400, statusMessage: "category_id inválido" })
  const t = v.trim()
  return t !== "" ? t : null
}

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const body = await readBody<
    Record<string, unknown>
  >(event)

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
  const idRaw = body.id != null ? String(body.id).trim() : ""

  /** Atualização por ID (valor da linha já existente). */
  if (idRaw !== "") {
    const { data: row, error: fetchErr } = await client
      .from("monthly_goals")
      .select("id, category_id, year, month")
      .eq("id", idRaw)
      .eq("user_id", userId)
      .maybeSingle()

    if (fetchErr) {
      throw createError({
        statusCode: 500,
        statusMessage: fetchErr.message,
      })
    }
    if (!row) {
      throw createError({
        statusCode: 404,
        statusMessage: "Meta não encontrada",
      })
    }

    if (row.year !== year || row.month !== monthNum) {
      throw createError({
        statusCode: 400,
        statusMessage: "month não coincide com esta meta",
      })
    }

    const { error: upErr } = await client
      .from("monthly_goals")
      .update({ amount })
      .eq("id", idRaw)
      .eq("user_id", userId)

    if (upErr) {
      throw createError({
        statusCode: 500,
        statusMessage: upErr.message,
      })
    }

    return {
      id: idRaw,
      amount,
      month: monthRaw,
      category_id: row.category_id,
    }
  }

  /** Criação ou upsert por (mês × categoria | geral null). */
  const category_id = normalizeOptionalCategory(body)

  if (category_id) {
    const { data: cat, error: catErr } = await client
      .from("categories")
      .select("id, type")
      .eq("id", category_id)
      .eq("user_id", userId)
      .maybeSingle()

    if (catErr) {
      throw createError({
        statusCode: 500,
        statusMessage: catErr.message,
      })
    }
    if (!cat || (cat.type as TxT) !== "expense") {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Categoria inválida ou não é despesa.",
      })
    }
  }

  const existingSel = category_id
    ? client
        .from("monthly_goals")
        .select("id")
        .eq("user_id", userId)
        .eq("year", year)
        .eq("month", monthNum)
        .eq("category_id", category_id)
    : client
        .from("monthly_goals")
        .select("id")
        .eq("user_id", userId)
        .eq("year", year)
        .eq("month", monthNum)
        .is("category_id", null)

  const { data: existing, error: selErr } = await existingSel.maybeSingle()

  if (selErr) {
    throw createError({
      statusCode: 500,
      statusMessage: selErr.message,
    })
  }

  if (existing?.id) {
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

    return { id: existing.id, amount, month: monthRaw, category_id }
  }

  const { data: inserted, error: insErr } = await client
    .from("monthly_goals")
    .insert({
      user_id: userId,
      year,
      month: monthNum,
      amount,
      category_id,
    })
    .select("id, amount, category_id")
    .single()

  if (insErr || !inserted) {
    throw createError({
      statusCode: 500,
      statusMessage: insErr?.message ?? "Erro ao criar meta.",
    })
  }

  return {
    id: inserted.id,
    amount: Number(inserted.amount),
    month: monthRaw,
    category_id: inserted.category_id ?? null,
  }
})
