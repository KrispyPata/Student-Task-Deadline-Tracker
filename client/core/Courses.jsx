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
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { apiRequest } from '../src/api'
import AppNavigation from './AppNavigation'

const emptyCourse = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  schedule: '',
}

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [form, setForm] = useState(emptyCourse)
  const [editingId, setEditingId] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState('')

  const loadCourses = useCallback(async () => {
    try {
      setError('')
      const data = await apiRequest('/api/courses')
      setCourses(data)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyCourse)
    setDialogOpen(true)
  }

  const openEdit = (course) => {
    setEditingId(course._id)

    setForm({
      name: course.name || '',
      description: course.description || '',
      startDate: course.startDate?.slice(0, 10) || '',
      endDate: course.endDate?.slice(0, 10) || '',
      schedule: course.schedule || '',
    })

    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingId(null)
    setForm(emptyCourse)
  }

  const saveCourse = async (event) => {
    event.preventDefault()

    try {
      setError('')

      await apiRequest(
        editingId
          ? `/api/courses/${editingId}`
          : '/api/courses',
        {
          method: editingId ? 'PUT' : 'POST',
          body: JSON.stringify(form),
        },
      )

      closeDialog()
      await loadCourses()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) {
      return
    }

    try {
      await apiRequest(`/api/courses/${id}`, {
        method: 'DELETE',
      })

      await loadCourses()
    } catch (err) {
      setError(err.message)
    }
  }

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
        }}
      >
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
                justifyContent: 'space-between',
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
                  Academic organization
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    color: '#fff',
                    fontWeight: 800,
                    mb: 0.7,
                  }}
                >
                  Courses
                </Typography>

                <Typography
                  sx={{
                    color: 'rgba(255,255,255,.72)',
                  }}
                >
                  Manage your subjects and course schedules.
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
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: 'none',

                  '&:hover': {
                    bgcolor: '#e9364d',
                    boxShadow: 'none',
                  },
                }}
              >
                Add course
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
              md: 'repeat(2, 1fr)',
            },
            gap: 2,
          }}
        >
          {courses.length === 0 ? (
            <Card
              sx={{
                gridColumn: '1 / -1',
              }}
            >
              <CardContent
                sx={{
                  py: 7,
                  textAlign: 'center',
                }}
              >
                <MenuBookIcon
                  sx={{
                    fontSize: 48,
                    color: '#ff4057',
                    mb: 1,
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  No courses yet
                </Typography>

                <Typography color="text.secondary">
                  Create your first course to begin organizing your subjects.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            courses.map((course) => (
              <Card key={course._id}>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight={800}
                        color="#252b3a"
                      >
                        {course.name}
                      </Typography>

                      {course.description && (
                        <Typography
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {course.description}
                        </Typography>
                      )}

                      {course.schedule && (
                        <Typography
                          variant="body2"
                          sx={{ mt: 1 }}
                        >
                          Schedule: {course.schedule}
                        </Typography>
                      )}

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {course.startDate
                          ? new Date(
                              course.startDate,
                            ).toLocaleDateString()
                          : 'No start date'}

                        {' — '}

                        {course.endDate
                          ? new Date(
                              course.endDate,
                            ).toLocaleDateString()
                          : 'No end date'}
                      </Typography>
                    </Box>

                    <Box>
                      <IconButton
                        onClick={() => openEdit(course)}
                        aria-label="Edit course"
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          deleteCourse(course._id)
                        }
                        aria-label="Delete course"
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

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box
          component="form"
          onSubmit={saveCourse}
        >
          <DialogTitle
            sx={{
              fontWeight: 800,
              color: '#252b3a',
            }}
          >
            {editingId
              ? 'Edit course'
              : 'Add course'}
          </DialogTitle>

          <DialogContent
            sx={{
              display: 'grid',
              gap: 2,
              pt: '12px !important',
            }}
          >
            <TextField
              label="Course name"
              value={form.name}
              required
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <TextField
              label="Description"
              value={form.description}
              multiline
              minRows={2}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

            <TextField
              label="Start date"
              type="date"
              value={form.startDate}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  startDate: e.target.value,
                })
              }
            />

            <TextField
              label="End date"
              type="date"
              value={form.endDate}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  endDate: e.target.value,
                })
              }
            />

            <TextField
              label="Schedule"
              placeholder="Example: Monday & Wednesday, 10:00 AM"
              value={form.schedule}
              onChange={(e) =>
                setForm({
                  ...form,
                  schedule: e.target.value,
                })
              }
            />
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
              sx={{
                bgcolor: '#ff4057',
                fontWeight: 700,
                textTransform: 'none',

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

export default Courses