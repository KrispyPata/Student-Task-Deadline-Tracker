const STORAGE_KEY = 'student-task-tracker-auth'

export const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export const saveAuth = (auth) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY)
}
