import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  AppBar,
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
  Toolbar,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../src/api'
import { clearAuth, getAuth } from '../src/auth'

const emptyTask = {
  title: '',
  course: '',
  dueDate: '',
  status: 'Not Started',
}

const statusColors = {
  'Not Started': 'default',
  'In Progress': 'warning',
  Done: 'success',
}

const Home = () => {
  const navigate = useNavigate()
  const auth = getAuth()

  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState(emptyTask)
  const [editingId, setEditingId] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')
  const [courseFilter, setCourseFilter] = useState('All')
  const [error, setError] = useState('')

  const loadTasks = useCallback(async () => {
    try {
      setError('')
      const data = await apiRequest('/api/tasks')
      setTasks(data)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const courses = useMemo(
    () => [...new Set(tasks.map((task) => task.course))].sort(),
    [tasks],
  )

  const filteredTasks = tasks.filter(
    (task) =>
      (statusFilter === 'All' || task.status === statusFilter) &&
      (courseFilter === 'All' || task.course === courseFilter),
  )

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyTask)
    setDialogOpen(true)
  }

  const openEdit = (task) => {
    setEditingId(task._id)
    setForm({
      title: task.title,
      course: task.course,
      dueDate: task.dueDate.slice(0, 10),
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
        editingId ? `/api/tasks/${editingId}` : '/api/tasks',
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
    const confirmed = window.confirm('Delete this task?')

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

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <Box>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ flexGrow: 1 }}
          >
            Student Task Tracker
          </Typography>

          <Typography
            sx={{
              mr: 2,
              display: {
                xs: 'none',
                sm: 'block',
              },
            }}
          >
            {auth?.user?.name}
          </Typography>

          <IconButton
            color="inherit"
            onClick={logout}
            aria-label="Log out"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          gap={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Assignments
            </Typography>

            <Typography color="text.secondary">
              Keep every course and deadline in one place.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            Add task
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
            >
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>

                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  {[
                    'All',
                    'Not Started',
                    'In Progress',
                    'Done',
                  ].map((status) => (
                    <MenuItem value={status} key={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Course</InputLabel>

                <Select
                  value={courseFilter}
                  label="Course"
                  onChange={(event) =>
                    setCourseFilter(event.target.value)
                  }
                >
                  <MenuItem value="All">All</MenuItem>

                  {courses.map((course) => (
                    <MenuItem value={course} key={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gap: 2 }}>
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent
                sx={{
                  py: 6,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6">
                  No tasks found
                </Typography>

                <Typography color="text.secondary">
                  Add an assignment or change your filters.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task._id}>
                <CardContent>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ sm: 'center' }}
                    gap={2}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight={700}>
                        {task.title}
                      </Typography>

                      <Typography color="text.secondary">
                        {task.course} · Due{' '}
                        {new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Chip
                      label={task.status}
                      color={statusColors[task.status]}
                    />

                    <Box>
                      <IconButton
                        onClick={() => openEdit(task)}
                        aria-label="Edit task"
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        onClick={() => deleteTask(task._id)}
                        aria-label="Delete task"
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
        <Box component="form" onSubmit={saveTask}>
          <DialogTitle>
            {editingId ? 'Edit task' : 'Add task'}
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
                  title: event.target.value,
                })
              }
              required
            />

            <TextField
              label="Course name"
              value={form.course}
              onChange={(event) =>
                setForm({
                  ...form,
                  course: event.target.value,
                })
              }
              required
            />

            <TextField
              label="Due date"
              type="date"
              value={form.dueDate}
              onChange={(event) =>
                setForm({
                  ...form,
                  dueDate: event.target.value,
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
                    status: event.target.value,
                  })
                }
              >
                {[
                  'Not Started',
                  'In Progress',
                  'Done',
                ].map((status) => (
                  <MenuItem value={status} key={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={closeDialog}>
              Cancel
            </Button>

            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}

export default Home