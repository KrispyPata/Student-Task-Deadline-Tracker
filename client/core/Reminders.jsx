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

const Reminders = () => {
  const [reminders, setReminders] = useState([])
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState(emptyReminder)

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
              'Notifications are now enabled.',
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
      sendTime: reminder.sendTime || '',
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
    if (
      !window.confirm(
        'Delete this reminder?',
      )
    ) {
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
              }}
            >
              <Box>
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
                  Create reminders for
                  important assignments and
                  deadlines.
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

                      borderRadius: '10px',

                      textTransform: 'none',

                      fontWeight: 700,

                      '&:hover': {
                        borderColor:
                          '#fff',

                        bgcolor:
                          'rgba(255,255,255,.08)',
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

                    textTransform: 'none',

                    fontWeight: 700,

                    boxShadow: 'none',

                    '&:hover': {
                      bgcolor:
                        '#e9364d',

                      boxShadow: 'none',
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
            sx={{ mb: 3 }}
          >
            Browser notifications are
            enabled. Reminders will appear
            while this application is open.
          </Alert>
        )}

        {notificationStatus ===
          'denied' && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
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
            sx={{ mb: 3 }}
          >
            This browser does not support
            desktop notifications.
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
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
            <Card>
              <CardContent
                sx={{
                  py: 7,
                  textAlign: 'center',
                }}
              >
                <NotificationsIcon
                  sx={{
                    color: '#ff4057',
                    fontSize: 48,
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

                        <Typography variant="body2">
                          Time:{' '}
                          {reminder.sendTime ||
                            'Not set'}
                        </Typography>

                        <Typography variant="body2">
                          Type:{' '}
                          {reminder.sendType ||
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

            {/* TIME */}
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

                '&:hover': {
                  bgcolor:
                    '#e9364d',
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