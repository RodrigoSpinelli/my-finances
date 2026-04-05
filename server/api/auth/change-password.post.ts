import { serverSupabaseClient } from "#supabase/server"

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    current_password?: unknown
    new_password?: unknown
  }>(event)

  const currentPassword = body.current_password
  const newPassword = body.new_password

  if (!isNonEmptyString(currentPassword) || !isNonEmptyString(newPassword)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Informe a senha atual e a nova senha.",
    })
  }

  if (newPassword.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: "A nova senha deve ter pelo menos 6 caracteres.",
    })
  }

  if (newPassword === currentPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: "A nova senha precisa ser diferente da atual.",
    })
  }

  const client = await serverSupabaseClient(event)

  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser()

  if (userError || !user?.email) {
    throw createError({
      statusCode: 401,
      statusMessage: "Não autenticado.",
    })
  }

  const { error: signError } = await client.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })

  if (signError) {
    throw createError({
      statusCode: 400,
      statusMessage: "Senha atual incorreta.",
    })
  }

  const { error: updateError } = await client.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    throw createError({
      statusCode: 400,
      statusMessage:
        updateError.message || "Não foi possível atualizar a senha.",
    })
  }

  return { ok: true as const }
})
