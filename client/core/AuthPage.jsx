import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../src/api'
import { saveAuth } from '../src/auth'
import logo from '../src/assets/student-task-tracker-logo.png'

const AuthPage = ({ mode }) => {
  const isRegister = mode === 'register'
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    })
  }

  const submit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        await apiRequest('/api/users', {
          method: 'POST',

          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        })
      }

      const auth =
        await apiRequest(
          '/auth/signin',
          {
            method: 'POST',

            body: JSON.stringify({
              email: form.email,
              password: form.password,
            }),
          },
        )

      saveAuth(auth)

      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',

        display: 'flex',
        alignItems: 'center',

        background: `
          radial-gradient(
            circle at 10% 20%,
            rgba(255,64,87,.09),
            transparent 30%
          ),
          radial-gradient(
            circle at 90% 80%,
            rgba(37,43,58,.08),
            transparent 32%
          ),
          #f7f8fb
        `,

        py: {
          xs: 4,
          md: 6,
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',

              md:
                'minmax(420px,.9fr) minmax(420px,1.1fr)',
            },

            alignItems: 'center',

            gap: {
              xs: 5,
              md: 8,
            },
          }}
        >
          {/* LEFT SIDE */}
          <Card
            sx={{
              width: '100%',
              maxWidth: 520,

              justifySelf: {
                xs: 'center',
                md: 'start',
              },

              borderRadius: 4,
              overflow: 'hidden',

              border:
                '1px solid rgba(37,43,58,.06)',

              boxShadow:
                '0 20px 60px rgba(37,43,58,.10)',

              position: 'relative',

              '&::before': {
                content: '""',

                position: 'absolute',

                top: 0,
                left: 0,
                right: 0,

                height: 7,

                background:
                  'linear-gradient(90deg,#ff4057 0%,#ff7180 48%,#252b3a 100%)',
              },
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 3,
                  sm: 5,
                },

                '&:last-child': {
                  pb: {
                    xs: 3,
                    sm: 5,
                  },
                },
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: '#ff4057',
                  fontWeight: 800,
                  letterSpacing: 1.5,
                }}
              >
                Student Task Tracker
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 1,
                  mb: 1,

                  fontWeight: 800,

                  color: '#252b3a',
                }}
              >
                {isRegister
                  ? 'Create your account'
                  : 'Welcome back'}
              </Typography>

              <Typography
                sx={{
                  mb: 4,
                  color: '#697083',
                  fontSize: '1rem',
                }}
              >
                {isRegister
                  ? 'Start organizing your assignments and deadlines.'
                  : 'Sign in to organize your academic workload.'}
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={submit}
                sx={{
                  display: 'grid',
                  gap: 2.2,
                }}
              >
                {isRegister && (
                  <TextField
                    name="name"
                    label="Name"

                    value={form.name}

                    onChange={
                      updateField
                    }

                    required
                    fullWidth
                  />
                )}

                <TextField
                  name="email"
                  label="Email"
                  type="email"

                  value={form.email}

                  onChange={
                    updateField
                  }

                  required
                  fullWidth
                />

                <TextField
                  name="password"
                  label="Password"
                  type="password"

                  value={
                    form.password
                  }

                  onChange={
                    updateField
                  }

                  required
                  fullWidth

                  inputProps={{
                    minLength: 6,
                  }}
                />

                <Button
                  type="submit"

                  variant="contained"

                  size="large"

                  disabled={loading}

                  sx={{
                    mt: 0.5,

                    py: 1.45,

                    borderRadius: 2.5,

                    bgcolor: '#ff4057',

                    color: '#fff',

                    fontWeight: 800,

                    fontSize: '.95rem',

                    textTransform: 'none',

                    '&:hover': {
                      bgcolor:
                        '#e9364d',
                    },
                  }}
                >
                  {loading
                    ? 'Please wait...'
                    : isRegister
                      ? 'Register'
                      : 'Login'}
                </Button>
              </Box>

              <Typography
                sx={{
                  mt: 3,
                  color: '#252b3a',
                }}
              >
                {isRegister
                  ? 'Already have an account? '
                  : 'Need an account? '}

                <Link
                  component="button"
                  type="button"

                  onClick={() =>
                    navigate(
                      isRegister
                        ? '/login'
                        : '/register',
                    )
                  }

                  sx={{
                    color: '#ff4057',
                    fontWeight: 700,
                  }}
                >
                  {isRegister
                    ? 'Login'
                    : 'Register'}
                </Link>
              </Typography>

              <Button
                onClick={() =>
                  navigate('/')
                }
                sx={{
                  mt: 2,
                  p: 0,
                  color: '#697083',
                  textTransform: 'none',
                  justifyContent:
                    'flex-start',
                }}
              >
                ← Back to home
              </Button>
            </CardContent>
          </Card>

          {/* RIGHT SIDE */}
          <Box
            sx={{
              display: 'flex',

              flexDirection: 'column',

              alignItems: 'center',

              justifyContent:
                'center',

              textAlign: 'center',

              minHeight: {
                xs: 'auto',
                md: 540,
              },
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Student Task Tracker"

              sx={{
                width: {
                  xs: 260,
                  sm: 340,
                  md: 460,
                },

                maxWidth: '100%',

                height: 'auto',

                objectFit: 'contain',

                mb: 3,

                filter:
                  'drop-shadow(0 18px 30px rgba(37,43,58,.14))',
              }}
            />

            <Typography
              sx={{
                color: '#697083',

                maxWidth: 500,

                fontSize: {
                  xs: '1rem',
                  md: '1.1rem',
                },

                lineHeight: 1.7,
              }}
            >
              Organize assignments,
              monitor deadlines, and keep
              track of your academic
              progress in one place.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default AuthPage