import { useEffect, useState } from 'react'
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
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../src/api'
import {
  clearAuth,
  getAuth,
  saveAuth,
} from '../src/auth'
import AppNavigation from './AppNavigation'

const Profile = () => {
  const navigate = useNavigate()
  const auth = getAuth()

  const [user, setUser] = useState(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
  })

  const [editOpen, setEditOpen] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadProfile = async () => {
    try {
      setError('')

      const data = await apiRequest(
        `/api/users/${auth.user._id}`,
      )

      setUser(data)

      setForm({
        name: data.name || '',
        email: data.email || '',
      })
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (auth?.user?._id) {
      loadProfile()
    }
  }, [])

  const openEdit = () => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
    })

    setEditOpen(true)
  }

  const closeEdit = () => {
    setEditOpen(false)
  }

  const saveProfile = async (event) => {
    event.preventDefault()

    try {
      setError('')
      setSuccess('')

      const updatedUser =
        await apiRequest(
          `/api/users/${auth.user._id}`,
          {
            method: 'PUT',

            body: JSON.stringify({
              name: form.name,
              email: form.email,
            }),
          },
        )

      setUser(updatedUser)

      saveAuth({
        ...auth,

        user: {
          ...auth.user,
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
      })

      setEditOpen(false)

      setSuccess(
        'Profile updated successfully.',
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteAccount = async () => {
    const confirmed =
      window.confirm(
        'Delete your account permanently? This action cannot be undone.',
      )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await apiRequest(
        `/api/users/${auth.user._id}`,
        {
          method: 'DELETE',
        },
      )

      clearAuth()
      navigate('/')
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

                justifyContent:
                  'space-between',

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
                  Account management
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    color: '#fff',
                    fontWeight: 800,
                    mb: 0.7,
                  }}
                >
                  My Profile
                </Typography>

                <Typography
                  sx={{
                    color:
                      'rgba(255,255,255,.72)',
                  }}
                >
                  View and manage your Student Task Tracker account.
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={openEdit}
                disabled={!user}
                sx={{
                  bgcolor: '#ff4057',
                  color: '#fff',

                  height: 42,
                  minWidth: 135,

                  px: 2.5,

                  borderRadius: '10px',

                  textTransform: 'none',
                  fontWeight: 700,

                  boxShadow: 'none',

                  transition:
                    'transform .2s ease, background-color .2s ease',

                  '&:hover': {
                    bgcolor: '#e9364d',
                    boxShadow: 'none',
                    transform:
                      'translateY(-2px)',
                  },
                }}
              >
                Edit profile
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

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
          >
            {success}
          </Alert>
        )}

        <Card
          sx={{
            transition:
              'transform .22s ease, box-shadow .22s ease',

            '&:hover': {
              transform:
                'translateY(-3px)',

              boxShadow:
                '0 12px 30px rgba(37,43,58,.12)',
            },
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >
            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              alignItems={{
                xs: 'flex-start',
                sm: 'center',
              }}
              spacing={3}
            >
              <Box
                sx={{
                  width: 90,
                  height: 90,

                  borderRadius: '50%',

                  bgcolor:
                    'rgba(255,64,87,.1)',

                  color: '#ff4057',

                  display: 'grid',
                  placeItems: 'center',

                  flexShrink: 0,

                  transition:
                    'transform .25s ease',

                  '.MuiCard-root:hover &': {
                    transform:
                      'scale(1.04)',
                  },
                }}
              >
                <PersonIcon
                  sx={{
                    fontSize: 48,
                  }}
                />
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#252b3a',
                    fontWeight: 800,
                  }}
                >
                  {user?.name ||
                    'Loading...'}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: '#697083',
                  }}
                >
                  {user?.email || ''}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color: '#9a9fad',
                  }}
                >
                  Student account
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                mt: 4,
                pt: 3,

                borderTop:
                  '1px solid #eceef2',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: '#252b3a',
                }}
              >
                Account details
              </Typography>

              <Box
                sx={{
                  display: 'grid',

                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2,1fr)',
                  },

                  gap: 2,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#f7f8fb',
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Full Name
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.4,
                      fontWeight: 700,
                      color: '#252b3a',
                    }}
                  >
                    {user?.name || '—'}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#f7f8fb',
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Email Address
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.4,
                      fontWeight: 700,
                      color: '#252b3a',
                    }}
                  >
                    {user?.email || '—'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 4,
                pt: 3,

                borderTop:
                  '1px solid #eceef2',
              }}
            >
              <Typography
                sx={{
                  color: '#252b3a',
                  fontWeight: 800,
                }}
              >
                Danger zone
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: '#697083',
                }}
              >
                Deleting your account is permanent and cannot be undone.
              </Typography>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={deleteAccount}
                sx={{
                  mt: 2,
                  textTransform: 'none',
                  fontWeight: 700,

                  transition:
                    'transform .2s ease',

                  '&:hover': {
                    transform:
                      'translateY(-1px)',
                  },
                }}
              >
                Delete account
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Dialog
        open={editOpen}
        onClose={closeEdit}
        fullWidth
        maxWidth="sm"
      >
        <Box
          component="form"
          onSubmit={saveProfile}
        >
          <DialogTitle
            sx={{
              color: '#252b3a',
              fontWeight: 800,
            }}
          >
            Edit profile
          </DialogTitle>

          <DialogContent
            sx={{
              display: 'grid',
              gap: 2,
              pt: '12px !important',
            }}
          >
            <TextField
              label="Full name"
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

            <TextField
              label="Email"
              type="email"
              value={form.email}
              required
              onChange={(event) =>
                setForm({
                  ...form,
                  email:
                    event.target.value,
                })
              }
            />
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={closeEdit}
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
                textTransform: 'none',
                fontWeight: 700,

                transition:
                  'transform .2s ease',

                '&:hover': {
                  bgcolor: '#e9364d',
                  transform:
                    'translateY(-1px)',
                },
              }}
            >
              Save changes
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}

export default Profile