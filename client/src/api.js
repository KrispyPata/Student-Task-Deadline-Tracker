import { getAuth } from './auth'

const API_URL = (
  import.meta.env.VITE_API_URL || ''
).replace(/\/$/, '')

export const apiRequest = async (
  path,
  options = {},
) => {
  const auth = getAuth()

  const headers = {
    'Content-Type': 'application/json',

    ...(auth?.token
      ? {
          Authorization: `Bearer ${auth.token}`,
        }
      : {}),

    ...(options.headers || {}),
  }

  let response

  try {
    response = await fetch(
      `${API_URL}${path}`,
      {
        ...options,
        headers,
      },
    )
  } catch (error) {
    console.error(
      'API connection error:',
      error,
    )

    throw new Error(
      'Unable to connect to the server.',
    )
  }

  /*
   * Some DELETE endpoints may return
   * an empty response.
   */
  const contentType =
    response.headers.get(
      'content-type',
    )

  let data = null

  if (
    contentType?.includes(
      'application/json',
    )
  ) {
    data = await response.json()
  } else {
    const text =
      await response.text()

    if (text) {
      data = {
        message: text,
      }
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`,
    )
  }

  return data
}