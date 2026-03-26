export function getFetchErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object") {
    const o = error as {
      data?: { statusMessage?: string; message?: string }
      statusMessage?: string
    }
    const fromData = o.data?.statusMessage ?? o.data?.message
    if (fromData)
      return fromData
    if (o.statusMessage)
      return o.statusMessage
  }
  if (error instanceof Error && error.message)
    return error.message
  return fallback
}
