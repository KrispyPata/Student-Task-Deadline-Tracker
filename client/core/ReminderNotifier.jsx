import { useCallback, useEffect, useRef } from 'react'
import { apiRequest } from '../src/api'

const STORAGE_KEY = 'student-task-reminder-history'

const getNotificationHistory = () => {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '{}',
    )
  } catch {
    return {}
  }
}

const saveNotificationHistory = (history) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history),
  )
}

const getCurrentTime = () => {
  const now = new Date()

  return `${String(now.getHours()).padStart(
    2,
    '0',
  )}:${String(now.getMinutes()).padStart(2, '0')}`
}

const getDailyKey = (date) => {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

const getWeeklyKey = (date) => {
  const startOfYear = new Date(
    date.getFullYear(),
    0,
    1,
  )

  const dayNumber = Math.floor(
    (date - startOfYear) / 86400000,
  )

  const weekNumber = Math.ceil(
    (dayNumber + startOfYear.getDay() + 1) / 7,
  )

  return `${date.getFullYear()}-week-${weekNumber}`
}

const getTriggerKey = (reminder, now) => {
  const frequency = (
    reminder.frequency || 'Once'
  ).toLowerCase()

  if (frequency === 'daily') {
    return `${reminder._id}:daily:${getDailyKey(now)}`
  }

  if (frequency === 'weekly') {
    return `${reminder._id}:weekly:${getWeeklyKey(now)}`
  }

  /*
   * "Once" reminders are only shown once ever
   * on this browser.
   */
  return `${reminder._id}:once`
}

const ReminderNotifier = () => {
  const checkingRef = useRef(false)

  const checkReminders = useCallback(async () => {
    if (checkingRef.current) {
      return
    }

    /*
     * Browser does not support notifications.
     */
    if (!('Notification' in window)) {
      return
    }

    /*
     * User has not granted permission.
     */
    if (Notification.permission !== 'granted') {
      return
    }

    checkingRef.current = true

    try {
      const reminders =
        await apiRequest('/api/reminders')

      const now = new Date()
      const currentTime = getCurrentTime()

      const history = getNotificationHistory()

      reminders.forEach((reminder) => {
        /*
         * Only trigger browser/in-app reminders.
         * Email reminders are ignored here.
         */
        const sendType = (
          reminder.sendType || ''
        ).toLowerCase()

        if (
          sendType &&
          sendType !== 'in app' &&
          sendType !== 'browser'
        ) {
          return
        }

        /*
         * sendTime from an HTML time field
         * should look like "23:32".
         */
        if (reminder.sendTime !== currentTime) {
          return
        }

        const triggerKey = getTriggerKey(
          reminder,
          now,
        )

        /*
         * Prevent duplicate notifications.
         */
        if (history[triggerKey]) {
          return
        }

        const taskTitle =
          typeof reminder.task === 'object'
            ? reminder.task?.title
            : ''

        const body = taskTitle
          ? `Task: ${taskTitle}`
          : 'You have an academic reminder.'

        const notification = new Notification(
          reminder.name || 'Task Reminder',
          {
            body,
            icon: '/favicon.ico',
            tag: triggerKey,
          },
        )

        notification.onclick = () => {
          window.focus()
          notification.close()
        }

        history[triggerKey] =
          new Date().toISOString()
      })

      saveNotificationHistory(history)
    } catch (error) {
      console.error(
        'Reminder notification check failed:',
        error,
      )
    } finally {
      checkingRef.current = false
    }
  }, [])

  useEffect(() => {
    /*
     * Run immediately when the app loads.
     */
    checkReminders()

    /*
     * Then check every 15 seconds.
     */
    const interval = window.setInterval(
      checkReminders,
      15000,
    )

    return () => {
      window.clearInterval(interval)
    }
  }, [checkReminders])

  return null
}

export default ReminderNotifier