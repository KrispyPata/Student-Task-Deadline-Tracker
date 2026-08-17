import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { apiRequest } from '../src/api'
import AppNavigation from './AppNavigation'

const emptyTask = {
  title: '',
  course: '',
  description: '',
  dueDate: '',
  status: 'Not Started',
}

const formatDateOnly = (date) => {
  if (!date) return ''

  const dateOnly = date.split('T')[0]
  const [year, month, day] = dateOnly.split('-')

  return `${Number(month)}/${Number(day)}/${year}`
}

const statusStyles = {
  'Not Started': {
    bgcolor: '#eef0f4',
    color: '#4d5568',
  },
  'In Progress': {
    bgcolor: '#fff0df',
    color: '#a35d12',
  },
  Done: {
    bgcolor: '#e6f6ef',
    color: '#237a56',
  },
}

const animatedCard = {
  transition:
    'transform 0.22s ease, box-shadow 0.22s ease',

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

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [availableCourses, setAvailableCourses] = useState([])
  const [form, setForm] = useState(emptyTask)
  const [editingId, setEditingId] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')
  const [courseFilter, setCourseFilter] = useState('All')
  const [error, setError] = useState('')

  const loadTasks = useCallback(async () => {
    try {
      const data = await apiRequest('/api/tasks')
      setTasks(data)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const loadCourses = useCallback(async () => {
    try {
      const data = await apiRequest('/api/courses')
      setAvailableCourses(data)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    const loadDashboardData = async () => {
      setError('')

      await Promise.all([
        loadTasks(),
        loadCourses(),
      ])
    }

    loadDashboardData()
  }, [loadTasks, loadCourses])

  const taskCourses = useMemo(
    () => [
      ...new Set(
        tasks
          .map((task) => task.course)
          .filter(Boolean),
      ),
    ].sort(),
    [tasks],
  )

  const filteredTasks = tasks.filter(
    (task) =>
      (statusFilter === 'All' ||
        task.status === statusFilter) &&
      (courseFilter === 'All' ||
        task.course === courseFilter),
  )

  const completedCount = tasks.filter(
    (task) => task.status === 'Done',
  ).length

  const activeCount = tasks.filter(
    (task) => task.status === 'In Progress',
  ).length

  const openCreate = async () => {
    setEditingId(null)
    setForm(emptyTask)

    await loadCourses()

    setDialogOpen(true)
  }

  const openEdit = async (task) => {
    await loadCourses()

    setEditingId(task._id)

    setForm({
      title: task.title,
      course: task.course,
      description: task.description || '',
      dueDate: task.dueDate?.slice(0, 10) || '',
      status: task.status,
    })

    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingId(null)
    setForm(emptyTask)
  }

  const saveTask = async (event) => {
    event.preventDefault()

    try {
      setError('')

      await apiRequest(
        editingId
          ? `/api/tasks/${editingId}`
          : '/api/tasks',
        {
          method: editingId ? 'PUT' : 'POST',
          body: JSON.stringify(form),
        },
      )

      closeDialog()
      await loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) {
      return
    }

    try {
      setError('')

      await apiRequest(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      await loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  const hasLegacyCourse =
    form.course &&
    !availableCourses.some(
      (course) => course.name === form.course,
    )

  return (
    <Box sx={{ minHeight: '100vh' }}>
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
              transform: 'translateY(12px)',
            },

            to: {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },

          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
          },
        }}
      >
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
                transform: 'translateY(-8px)',
              },

              to: {
                opacity: 1,
                transform: 'translateY(0)',
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

                alignItems: {
                  xs: 'flex-start',
                  sm: 'center',
                },

                justifyContent: 'space-between',

                width: '100%',
                gap: 3,
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
                  Academic command center
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    color: '#fff',
                    mb: 0.7,
                    fontWeight: 800,
                  }}
                >
                  Assignments
                </Typography>

                <Typography
                  sx={{
                    color:
                      'rgba(255,255,255,.72)',
                  }}
                >
                  Keep every course, deadline, and progress update in one place.
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreate}
                sx={{
                  bgcolor: '#ff4057',
                  color: '#fff',

                  minWidth: '125px',
                  height: '42px',

                  px: 2,

                  borderRadius: '10px',

                  fontSize: '0.85rem',
                  fontWeight: 700,

                  textTransform: 'none',
                  whiteSpace: 'nowrap',

                  boxShadow: 'none',

                  transition:
                    'transform .2s ease, background-color .2s ease',

                  '&:hover': {
                    bgcolor: '#e9364d',
                    boxShadow: 'none',
                    transform: 'translateY(-2px)',
                  },

                  '& .MuiButton-startIcon': {
                    marginRight: '6px',
                  },

                  '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none',

                    '&:hover': {
                      transform: 'none',
                    },
                  },
                }}
              >
                Add task
              </Button>
            </Box>
          </CardContent>
        </Card>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, 1fr)',
            },

            gap: 2,
            mb: 3,
          }}
        >
          {[
            ['Total tasks', tasks.length],
            ['In progress', activeCount],
            ['Completed', completedCount],
          ].map(([label, value], index) => (
            <Card
              key={label}
              sx={animatedCard}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {label}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mt: 0.5,
                    fontWeight: 800,

                    color:
                      index === 2
                        ? '#2e9d6f'
                        : index === 1
                          ? '#ff4057'
                          : '#252b3a',
                  }}
                >
                  {value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Card
          sx={{
            mb: 3,
            ...animatedCard,
          }}
        >
          <CardContent>
            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={2}
            >
              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel>Status</InputLabel>

                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value,
                    )
                  }
                >
                  {[
                    'All',
                    'Not Started',
                    'In Progress',
                    'Done',
                  ].map((status) => (
                    <MenuItem
                      value={status}
                      key={status}
                    >
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel>Course</InputLabel>

                <Select
                  value={courseFilter}
                  label="Course"
                  onChange={(event) =>
                    setCourseFilter(
                      event.target.value,
                    )
                  }
                >
                  <MenuItem value="All">
                    All
                  </MenuItem>

                  {taskCourses.map((course) => (
                    <MenuItem
                      value={course}
                      key={course}
                    >
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
          }}
        >
          {filteredTasks.length === 0 ? (
            <Card sx={animatedCard}>
              <CardContent
                sx={{
                  py: 7,
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 54,
                    height: 54,

                    borderRadius: '50%',

                    display: 'grid',
                    placeItems: 'center',

                    bgcolor:
                      'rgba(255,64,87,.09)',

                    color: '#ff4057',

                    mx: 'auto',
                    mb: 2,

                    fontSize: 28,
                    fontWeight: 800,
                  }}
                >
                  +
                </Box>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  No tasks found
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Add an assignment or change your filters.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card
                key={task._id}
                sx={animatedCard}
              >
                <CardContent
                  sx={{
                    p: {
                      xs: 2.5,
                      sm: 3,
                    },
                  }}
                >
                  <Stack
                    direction={{
                      xs: 'column',
                      sm: 'row',
                    }}
                    alignItems={{
                      sm: 'center',
                    }}
                    gap={2}
                  >
                    <Box
                      sx={{
                        width: 5,

                        alignSelf:
                          'stretch',

                        bgcolor:
                          '#ff4057',

                        borderRadius: 99,

                        flexShrink: 0,
                      }}
                    />

                    <Box
                      sx={{
                        flexGrow: 1,

                        pl: {
                          xs: 0,
                          sm: 1.5,
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        {task.title}
                      </Typography>

                      <Typography color="text.secondary">
                        {task.course} · Due{' '}
                        {formatDateOnly(
                          task.dueDate,
                        )}
                      </Typography>

                      {task.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1,
                            color:
                              'text.secondary',
                          }}
                        >
                          {task.description}
                        </Typography>
                      )}
                    </Box>

                    <Chip
                      label={task.status}
                      sx={{
                        ...statusStyles[
                        task.status
                        ],

                        fontWeight: 700,
                      }}
                    />

                    <Box>
                      <IconButton
                        onClick={() =>
                          openEdit(task)
                        }
                        aria-label="Edit task"
                        sx={{
                          color: '#252b3a',

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
                          deleteTask(
                            task._id,
                          )
                        }
                        aria-label="Delete task"
                        sx={{
                          color: '#ff4057',

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
            ))
          )}
        </Box>
      </Container>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box
          component="form"
          onSubmit={saveTask}
        >
          <DialogTitle
            sx={{
              fontWeight: 800,
              color: '#252b3a',
            }}
          >
            {editingId
              ? 'Edit task'
              : 'Add task'}
          </DialogTitle>

          <DialogContent
            sx={{
              display: 'grid',
              gap: 2,
              pt: '12px !important',
            }}
          >
            <TextField
              label="Assignment / task"
              value={form.title}
              onChange={(event) =>
                setForm({
                  ...form,
                  title:
                    event.target.value,
                })
              }
              required
            />

            <FormControl
              fullWidth
              required
            >
              <InputLabel>Course</InputLabel>

              <Select
                value={form.course}
                label="Course"
                onChange={(event) =>
                  setForm({
                    ...form,
                    course:
                      event.target.value,
                  })
                }
              >
                {hasLegacyCourse && (
                  <MenuItem
                    value={form.course}
                  >
                    {form.course}
                  </MenuItem>
                )}

                {availableCourses.map(
                  (course) => (
                    <MenuItem
                      key={course._id}
                      value={course.name}
                    >
                      {course.name}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>

            {availableCourses.length ===
              0 && (
                <Alert severity="info">
                  You currently have no courses. Go to the Courses page and add a course before creating an assignment.
                </Alert>
              )}

            <TextField
              label="Description"
              value={form.description}
              onChange={(event) =>
                setForm({
                  ...form,

                  description:
                    event.target.value,
                })
              }
              multiline
              minRows={2}
              placeholder="Optional notes about this assignment"
            />

            <TextField
              label="Due date"
              type="date"
              value={form.dueDate}
              onChange={(event) =>
                setForm({
                  ...form,

                  dueDate:
                    event.target.value,
                })
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              required
            />

            <FormControl>
              <InputLabel>Status</InputLabel>

              <Select
                value={form.status}
                label="Status"
                onChange={(event) =>
                  setForm({
                    ...form,

                    status:
                      event.target.value,
                  })
                }
              >
                {[
                  'Not Started',
                  'In Progress',
                  'Done',
                ].map((status) => (
                  <MenuItem
                    value={status}
                    key={status}
                  >
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={closeDialog}
              sx={{
                color: '#252b3a',
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={
                availableCourses.length ===
                0 &&
                !hasLegacyCourse
              }
              sx={{
                bgcolor: '#ff4057',
                textTransform: 'none',
                fontWeight: 700,

                transition:
                  'transform .2s ease, background-color .2s ease',

                '&:hover': {
                  bgcolor: '#e9364d',
                  transform:
                    'translateY(-1px)',
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

export default Home