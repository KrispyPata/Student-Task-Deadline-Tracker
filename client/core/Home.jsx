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

const Home = () => {
  const [tasks, setTasks] = useState([])

  // Courses loaded from the Courses collection
  const [availableCourses, setAvailableCourses] = useState([])

  const [form, setForm] = useState(emptyTask)
  const [editingId, setEditingId] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [statusFilter, setStatusFilter] = useState('All')
  const [courseFilter, setCourseFilter] = useState('All')

  const [error, setError] = useState('')

  /*
   * LOAD TASKS
   */
  const loadTasks = useCallback(async () => {
    try {
      const data = await apiRequest('/api/tasks')
      setTasks(data)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  /*
   * LOAD COURSES
   *
   * These courses are used in the Add/Edit Task dropdown.
   */
  const loadCourses = useCallback(async () => {
    try {
      const data = await apiRequest('/api/courses')
      setAvailableCourses(data)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  /*
   * LOAD DASHBOARD DATA
   */
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

  /*
   * COURSE FILTER OPTIONS
   *
   * We use courses from existing tasks here so older tasks
   * can still be filtered even if their course was deleted.
   */
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

  /*
   * FILTERED TASKS
   */
  const filteredTasks = tasks.filter(
    (task) =>
      (statusFilter === 'All' ||
        task.status === statusFilter) &&
      (courseFilter === 'All' ||
        task.course === courseFilter),
  )

  /*
   * DASHBOARD COUNTERS
   */
  const completedCount = tasks.filter(
    (task) => task.status === 'Done',
  ).length

  const activeCount = tasks.filter(
    (task) => task.status === 'In Progress',
  ).length

  /*
   * OPEN ADD TASK
   */
  const openCreate = async () => {
    setEditingId(null)
    setForm(emptyTask)

    // Refresh courses before opening
    await loadCourses()

    setDialogOpen(true)
  }

  /*
   * OPEN EDIT TASK
   */
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

  /*
   * CLOSE DIALOG
   */
  const closeDialog = () => {
    setDialogOpen(false)
    setEditingId(null)
    setForm(emptyTask)
  }

  /*
   * CREATE / UPDATE TASK
   */
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

  /*
   * DELETE TASK
   */
  const deleteTask = async (taskId) => {
    const confirmed = window.confirm(
      'Delete this task?',
    )

    if (!confirmed) {
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

  /*
   * Check if an older task contains a course
   * that no longer exists in the Courses collection.
   */
  const hasLegacyCourse =
    form.course &&
    !availableCourses.some(
      (course) => course.name === form.course,
    )

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* SHARED NAVIGATION */}
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
                    color: 'rgba(255,255,255,.72)',
                  }}
                >
                  Keep every course, deadline, and
                  progress update in one place.
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreate}
                sx={{
                  bgcolor: '#ff4057',
                  color: '#fff',

                  width: '110px',
                  minWidth: '110px',
                  height: '42px',

                  px: 1.5,
                  py: 0,

                  borderRadius: '10px',

                  fontSize: '0.82rem',
                  fontWeight: 700,
                  lineHeight: 1,

                  textTransform: 'none',
                  whiteSpace: 'nowrap',

                  flexGrow: 0,
                  flexShrink: 0,

                  boxShadow: 'none',

                  '&:hover': {
                    bgcolor: '#e9364d',
                    boxShadow: 'none',
                  },

                  '& .MuiButton-startIcon': {
                    marginRight: '5px',
                  },
                }}
              >
                Add task
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* ERROR MESSAGE */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* STATISTICS */}
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
            <Card key={label}>
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

        {/* FILTERS */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={2}
            >
              {/* STATUS FILTER */}
              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel>
                  Status
                </InputLabel>

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

              {/* COURSE FILTER */}
              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel>
                  Course
                </InputLabel>

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

        {/* TASK LIST */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
          }}
        >
          {filteredTasks.length === 0 ? (
            <Card>
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
                  Add an assignment or change your
                  filters.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task._id}>
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
                    {/* RED SIDE BAR */}
                    <Box
                      sx={{
                        width: 5,
                        alignSelf: 'stretch',

                        bgcolor: '#ff4057',

                        borderRadius: 99,

                        flexShrink: 0,
                      }}
                    />

                    {/* TASK INFORMATION */}
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

                        {new Date(
                          task.dueDate,
                        ).toLocaleDateString()}
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

                    {/* STATUS */}
                    <Chip
                      label={task.status}
                      sx={{
                        ...statusStyles[
                          task.status
                        ],

                        fontWeight: 700,
                      }}
                    />

                    {/* ACTION BUTTONS */}
                    <Box>
                      <IconButton
                        onClick={() =>
                          openEdit(task)
                        }
                        aria-label="Edit task"
                        sx={{
                          color: '#252b3a',
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

      {/* ADD / EDIT TASK DIALOG */}
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
            {/* ASSIGNMENT NAME */}
            <TextField
              label="Assignment / task"
              value={form.title}
              onChange={(event) =>
                setForm({
                  ...form,
                  title: event.target.value,
                })
              }
              required
            />

            {/* COURSE DROPDOWN */}
            <FormControl
              fullWidth
              required
            >
              <InputLabel>
                Course
              </InputLabel>

              <Select
                value={form.course}
                label="Course"
                onChange={(event) =>
                  setForm({
                    ...form,
                    course: event.target.value,
                  })
                }
              >
                {/* OLD COURSE SUPPORT */}
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

            {/* MESSAGE IF USER HAS NO COURSES */}
            {availableCourses.length === 0 && (
              <Alert severity="info">
                You currently have no courses. Go to
                the Courses page and add a course
                before creating an assignment.
              </Alert>
            )}

            {/* DESCRIPTION */}
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

            {/* DUE DATE */}
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

            {/* STATUS */}
            <FormControl>
              <InputLabel>
                Status
              </InputLabel>

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
              type="submit"
              variant="contained"
              disabled={
                availableCourses.length === 0 &&
                !hasLegacyCourse
              }
              sx={{
                bgcolor: '#ff4057',
                textTransform: 'none',
                fontWeight: 700,

                '&:hover': {
                  bgcolor: '#e9364d',
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