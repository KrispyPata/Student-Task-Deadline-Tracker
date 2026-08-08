import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { apiRequest } from '../src/api'
import AppNavigation from './AppNavigation'

const emptyReminder = {
  name: '',
  frequency: 'Once',
  task: '',
  sendTime: '',
  sendType: 'In App',
}

const animatedCard = {
  transition:
    'transform .22s ease, box-shadow .22s ease',

  '&:hover': {
    transform: 'translateY(-3px)',

    boxShadow:
      '0 12px 30px rgba(37,43,58,.12)',
  },

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',

    '&:hover': {
      transform: 'none',
    },
  },
}

const Reminders = () => {
  const [reminders, setReminders] = useState([])
  const [tasks, setTasks] = useState([])

  const [form, setForm] = useState(
    emptyReminder,
  )

  const [editingId, setEditingId] =
    useState(null)

  const [dialogOpen, setDialogOpen] =
    useState(false)

  const [error, setError] = useState('')

  const [notificationStatus, setNotificationStatus] =
    useState(
      'Notification' in window
        ? Notification.permission
        : 'unsupported',
    )

  const loadData = useCallback(async () => {
    try {
      setError('')

      const [reminderData, taskData] =
        await Promise.all([
          apiRequest('/api/reminders'),
          apiRequest('/api/tasks'),
        ])

      setReminders(reminderData)
      setTasks(taskData)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      setError(
        'Your browser does not support notifications.',
      )

      return
    }

    try {
      const permission =
        await Notification.requestPermission()

      setNotificationStatus(permission)

      if (permission === 'granted') {
        new Notification(
          'Student Task Tracker',
          {
            body:
              'Notifications are now enabled. Your reminders will be checked every 15 seconds while the app is open.',
          },
        )
      }
    } catch {
      setError(
        'Unable to request notification permission.',
      )
    }
  }

  const openCreate = () => {
    setEditingId(null)

    setForm(emptyReminder)

    setDialogOpen(true)
  }

  const openEdit = (reminder) => {
    const taskId =
      typeof reminder.task === 'object'
        ? reminder.task?._id
        : reminder.task

    setEditingId(reminder._id)

    setForm({
      name: reminder.name || '',

      frequency:
        reminder.frequency || 'Once',

      task: taskId || '',

      sendTime:
        reminder.sendTime || '',

      sendType:
        reminder.sendType || 'In App',
    })

    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingId(null)

    setForm(emptyReminder)
  }

  const saveReminder = async (event) => {
    event.preventDefault()

    try {
      setError('')

      await apiRequest(
        editingId
          ? `/api/reminders/${editingId}`
          : '/api/reminders',
        {
          method:
            editingId
              ? 'PUT'
              : 'POST',

          body: JSON.stringify(form),
        },
      )

      closeDialog()

      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteReminder = async (id) => {
    const confirmed = window.confirm(
      'Delete this reminder?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await apiRequest(
        `/api/reminders/${id}`,
        {
          method: 'DELETE',
        },
      )

      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const taskName = (reminder) => {
    if (
      reminder.task &&
      typeof reminder.task === 'object'
    ) {
      return (
        reminder.task.title ||
        'Task'
      )
    }

    const task = tasks.find(
      (item) =>
        item._id === reminder.task,
    )

    return (
      task?.title ||
      'No task selected'
    )
  }

  const formatTime = (time) => {
    if (!time) {
      return 'Not set'
    }

    const [hour, minute] =
      time.split(':')

    const date = new Date()

    date.setHours(
      Number(hour),
      Number(minute),
      0,
      0,
    )

    return date.toLocaleTimeString(
      [],
      {
        hour: 'numeric',
        minute: '2-digit',
      },
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
      }}
    >
      <AppNavigation />

      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 3,
            md: 5,
          },

          animation:
            'pageEnter .38s ease both',

          '@keyframes pageEnter': {
            from: {
              opacity: 0,

              transform:
                'translateY(12px)',
            },

            to: {
              opacity: 1,

              transform:
                'translateY(0)',
            },
          },

          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
          },
        }}
      >
        {/* HERO */}
        <Card
          sx={{
            mb: 3,

            border: 0,

            color: '#fff',

            background:
              'linear-gradient(120deg, #252b3a 0%, #343b50 62%, #ff4057 145%)',

            animation:
              'heroEnter .45s ease both',

            '@keyframes heroEnter': {
              from: {
                opacity: 0,

                transform:
                  'translateY(-8px)',
              },

              to: {
                opacity: 1,

                transform:
                  'translateY(0)',
              },
            },

            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },

              '&:last-child': {
                pb: {
                  xs: 3,
                  md: 4,
                },
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',

                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },

                justifyContent:
                  'space-between',

                alignItems: {
                  xs: 'flex-start',
                  sm: 'center',
                },

                gap: 3,

                width: '100%',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: '#ff7180',

                    fontWeight: 800,

                    letterSpacing: 1.4,
                  }}
                >
                  Never miss a deadline
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    color: '#fff',

                    fontWeight: 800,

                    mb: 0.7,
                  }}
                >
                  Reminders
                </Typography>

                <Typography
                  sx={{
                    color:
                      'rgba(255,255,255,.72)',
                  }}
                >
                  Create browser reminders
                  for important assignments
                  and deadlines.
                </Typography>
              </Box>

              <Stack
                direction={{
                  xs: 'column',
                  sm: 'row',
                }}
                spacing={1}
              >
                {notificationStatus !==
                  'granted' && (
                  <Button
                    variant="outlined"

                    startIcon={
                      <NotificationsActiveIcon />
                    }

                    onClick={
                      enableNotifications
                    }

                    sx={{
                      color: '#fff',

                      borderColor:
                        'rgba(255,255,255,.45)',

                      height: 42,

                      borderRadius:
                        '10px',

                      textTransform:
                        'none',

                      fontWeight: 700,

                      transition:
                        'transform .2s ease, background-color .2s ease, border-color .2s ease',

                      '&:hover': {
                        borderColor:
                          '#fff',

                        bgcolor:
                          'rgba(255,255,255,.08)',

                        transform:
                          'translateY(-2px)',
                      },

                      '@media (prefers-reduced-motion: reduce)': {
                        transition: 'none',

                        '&:hover': {
                          transform: 'none',
                        },
                      },
                    }}
                  >
                    Enable notifications
                  </Button>
                )}

                <Button
                  variant="contained"

                  startIcon={<AddIcon />}

                  onClick={openCreate}

                  sx={{
                    bgcolor: '#ff4057',

                    color: '#fff',

                    minWidth: '145px',

                    height: '42px',

                    borderRadius:
                      '10px',

                    textTransform:
                      'none',

                    fontWeight: 700,

                    boxShadow: 'none',

                    transition:
                      'transform .2s ease, background-color .2s ease',

                    '&:hover': {
                      bgcolor:
                        '#e9364d',

                      boxShadow: 'none',

                      transform:
                        'translateY(-2px)',
                    },

                    '@media (prefers-reduced-motion: reduce)': {
                      transition: 'none',

                      '&:hover': {
                        transform: 'none',
                      },
                    },
                  }}
                >
                  Add reminder
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* NOTIFICATION STATUS */}
        {notificationStatus ===
          'granted' && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
            }}
          >
            Browser notifications are
            enabled. Reminders are checked
            every 15 seconds while this
            application is open.
          </Alert>
        )}

        {notificationStatus ===
          'denied' && (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
            }}
          >
            Browser notifications are
            blocked. Allow notifications
            for this site in your browser
            settings.
          </Alert>
        )}

        {notificationStatus ===
          'unsupported' && (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
            }}
          >
            This browser does not support
            desktop notifications.
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
          >
            {error}
          </Alert>
        )}

        {/* REMINDER LIST */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
          }}
        >
          {reminders.length === 0 ? (
            <Card sx={animatedCard}>
              <CardContent
                sx={{
                  py: 7,

                  textAlign:
                    'center',
                }}
              >
                <NotificationsIcon
                  sx={{
                    color: '#ff4057',

                    fontSize: 48,

                    transition:
                      'transform .25s ease',

                    '.MuiCard-root:hover &':
                      {
                        transform:
                          'scale(1.08)',
                      },
                  }}
                />

                <Typography
                  variant="h6"

                  fontWeight={700}

                  sx={{
                    mt: 1,
                  }}
                >
                  No reminders yet
                </Typography>

                <Typography
                  color="text.secondary"
                >
                  Create a reminder for an
                  upcoming task.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            reminders.map(
              (reminder) => (
                <Card
                  key={reminder._id}
                  sx={animatedCard}
                >
                  <CardContent>
                    <Stack
                      direction={{
                        xs: 'column',
                        sm: 'row',
                      }}

                      alignItems={{
                        sm: 'center',
                      }}

                      spacing={2}
                    >
                      <NotificationsIcon
                        sx={{
                          color:
                            '#ff4057',

                          fontSize: 34,

                          transition:
                            'transform .22s ease',

                          '.MuiCard-root:hover &':
                            {
                              transform:
                                'scale(1.08)',
                            },
                        }}
                      />

                      <Box
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        <Typography
                          variant="h6"

                          fontWeight={800}

                          color="#252b3a"
                        >
                          {reminder.name}
                        </Typography>

                        <Typography
                          color="text.secondary"
                        >
                          Task:{' '}
                          {taskName(
                            reminder,
                          )}
                        </Typography>

                        <Typography
                          variant="body2"

                          sx={{
                            mt: 0.8,
                          }}
                        >
                          Frequency:{' '}
                          {reminder.frequency ||
                            'Not set'}
                        </Typography>

                        <Typography
                          variant="body2"
                        >
                          Time:{' '}
                          {formatTime(
                            reminder.sendTime,
                          )}
                        </Typography>

                        <Typography
                          variant="body2"
                        >
                          Type:{' '}
                          {reminder.sendType ===
                          'In App'
                            ? 'Browser notification'
                            : reminder.sendType ||
                              'Not set'}
                        </Typography>
                      </Box>

                      <Box>
                        <IconButton
                          onClick={() =>
                            openEdit(
                              reminder,
                            )
                          }

                          aria-label="Edit reminder"

                          sx={{
                            color:
                              '#252b3a',

                            transition:
                              'transform .18s ease',

                            '&:hover': {
                              transform:
                                'scale(1.08)',
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          onClick={() =>
                            deleteReminder(
                              reminder._id,
                            )
                          }

                          aria-label="Delete reminder"

                          sx={{
                            color:
                              '#ff4057',

                            transition:
                              'transform .18s ease',

                            '&:hover': {
                              transform:
                                'scale(1.08)',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ),
            )
          )}
        </Box>
      </Container>

      {/* ADD / EDIT REMINDER */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box
          component="form"
          onSubmit={saveReminder}
        >
          <DialogTitle
            sx={{
              fontWeight: 800,
              color: '#252b3a',
            }}
          >
            {editingId
              ? 'Edit reminder'
              : 'Add reminder'}
          </DialogTitle>

          <DialogContent
            sx={{
              display: 'grid',

              gap: 2,

              pt:
                '12px !important',
            }}
          >
            {/* NAME */}
            <TextField
              label="Reminder name"

              value={form.name}

              required

              onChange={(event) =>
                setForm({
                  ...form,

                  name:
                    event.target.value,
                })
              }
            />

            {/* TASK */}
            <FormControl fullWidth>
              <InputLabel>
                Task
              </InputLabel>

              <Select
                value={form.task}

                label="Task"

                onChange={(event) =>
                  setForm({
                    ...form,

                    task:
                      event.target.value,
                  })
                }
              >
                <MenuItem value="">
                  None
                </MenuItem>

                {tasks.map((task) => (
                  <MenuItem
                    value={task._id}
                    key={task._id}
                  >
                    {task.title}
                    {task.course
                      ? ` — ${task.course}`
                      : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* FREQUENCY */}
            <FormControl
              fullWidth
              required
            >
              <InputLabel>
                Frequency
              </InputLabel>

              <Select
                value={
                  form.frequency
                }

                label="Frequency"

                onChange={(event) =>
                  setForm({
                    ...form,

                    frequency:
                      event.target.value,
                  })
                }
              >
                <MenuItem value="Once">
                  Once
                </MenuItem>

                <MenuItem value="Daily">
                  Daily
                </MenuItem>

                <MenuItem value="Weekly">
                  Weekly
                </MenuItem>
              </Select>
            </FormControl>

            {/* SEND TIME */}
            <TextField
              label="Send time"

              type="time"

              value={form.sendTime}

              required

              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}

              onChange={(event) =>
                setForm({
                  ...form,

                  sendTime:
                    event.target.value,
                })
              }
            />

            {/* SEND TYPE */}
            <FormControl
              fullWidth
              required
            >
              <InputLabel>
                Send type
              </InputLabel>

              <Select
                value={form.sendType}

                label="Send type"

                onChange={(event) =>
                  setForm({
                    ...form,

                    sendType:
                      event.target.value,
                  })
                }
              >
                <MenuItem value="In App">
                  Browser notification
                </MenuItem>
              </Select>
            </FormControl>

            <Alert severity="info">
              Browser notifications are
              checked every 15 seconds while
              Student Task Tracker is open.
            </Alert>
          </DialogContent>

          <DialogActions
            sx={{
              p: 2.5,
            }}
          >
            <Button
              onClick={closeDialog}

              sx={{
                color: '#252b3a',
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"

              type="submit"

              sx={{
                bgcolor: '#ff4057',

                fontWeight: 700,

                textTransform: 'none',

                transition:
                  'transform .2s ease, background-color .2s ease',

                '&:hover': {
                  bgcolor:
                    '#e9364d',

                  transform:
                    'translateY(-1px)',
                },

                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',

                  '&:hover': {
                    transform: 'none',
                  },
                },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}

export default Reminders