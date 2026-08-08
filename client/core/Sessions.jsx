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
import EventIcon from '@mui/icons-material/Event'
import { apiRequest } from '../src/api'
import AppNavigation from './AppNavigation'

const emptySession = {
  name: '',
  frequency: '',
  purpose: '',
  startTime: '',
  endTime: '',
}

const Sessions = () => {
  const [sessions, setSessions] = useState([])
  const [form, setForm] = useState(emptySession)
  const [editingId, setEditingId] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState('')

  const loadSessions = useCallback(async () => {
    try {
      setError('')
      const data = await apiRequest('/api/sessions')
      setSessions(data)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptySession)
    setDialogOpen(true)
  }

  const openEdit = (session) => {
    setEditingId(session._id)

    setForm({
      name: session.name || '',
      frequency: session.frequency || '',
      purpose: session.purpose || '',
      startTime: session.startTime || '',
      endTime: session.endTime || '',
    })

    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingId(null)
    setForm(emptySession)
  }

  const saveSession = async (event) => {
    event.preventDefault()

    try {
      setError('')

      await apiRequest(
        editingId
          ? `/api/sessions/${editingId}`
          : '/api/sessions',
        {
          method: editingId ? 'PUT' : 'POST',
          body: JSON.stringify(form),
        },
      )

      closeDialog()
      await loadSessions()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteSession = async (id) => {
    if (!window.confirm('Delete this session?')) {
      return
    }

    try {
      await apiRequest(`/api/sessions/${id}`, {
        method: 'DELETE',
      })

      await loadSessions()
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
                  Study planning
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    color: '#fff',
                    fontWeight: 800,
                    mb: 0.7,
                  }}
                >
                  Sessions
                </Typography>

                <Typography
                  sx={{
                    color: 'rgba(255,255,255,.72)',
                  }}
                >
                  Plan study sessions and recurring academic activities.
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreate}
                sx={{
                  bgcolor: '#ff4057',
                  color: '#fff',
                  minWidth: '130px',
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
                Add session
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
            gap: 2,
          }}
        >
          {sessions.length === 0 ? (
            <Card>
              <CardContent
                sx={{
                  py: 7,
                  textAlign: 'center',
                }}
              >
                <EventIcon
                  sx={{
                    fontSize: 48,
                    color: '#ff4057',
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ mt: 1 }}
                >
                  No sessions yet
                </Typography>

                <Typography color="text.secondary">
                  Add a study or academic session.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card key={session._id}>
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
                    <EventIcon
                      sx={{
                        color: '#ff4057',
                        fontSize: 34,
                      }}
                    />

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight={800}
                        color="#252b3a"
                      >
                        {session.name}
                      </Typography>

                      <Typography color="text.secondary">
                        {session.purpose ||
                          'No purpose provided'}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                      >
                        Frequency:{' '}
                        {session.frequency || 'Not set'}
                      </Typography>

                      <Typography variant="body2">
                        Time:{' '}
                        {session.startTime || '—'}
                        {' - '}
                        {session.endTime || '—'}
                      </Typography>
                    </Box>

                    <Box>
                      <IconButton
                        onClick={() =>
                          openEdit(session)
                        }
                        aria-label="Edit session"
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          deleteSession(session._id)
                        }
                        aria-label="Delete session"
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
          onSubmit={saveSession}
        >
          <DialogTitle
            sx={{
              fontWeight: 800,
              color: '#252b3a',
            }}
          >
            {editingId
              ? 'Edit session'
              : 'Add session'}
          </DialogTitle>

          <DialogContent
            sx={{
              display: 'grid',
              gap: 2,
              pt: '12px !important',
            }}
          >
            <TextField
              label="Session name"
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
              label="Purpose"
              value={form.purpose}
              onChange={(e) =>
                setForm({
                  ...form,
                  purpose: e.target.value,
                })
              }
            />

            <TextField
              label="Frequency"
              placeholder="Daily, Weekly, Monday..."
              value={form.frequency}
              onChange={(e) =>
                setForm({
                  ...form,
                  frequency: e.target.value,
                })
              }
            />

            <TextField
              label="Start time"
              type="time"
              value={form.startTime}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  startTime: e.target.value,
                })
              }
            />

            <TextField
              label="End time"
              type="time"
              value={form.endTime}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              onChange={(e) =>
                setForm({
                  ...form,
                  endTime: e.target.value,
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
              variant="contained"
              type="submit"
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

export default Sessions