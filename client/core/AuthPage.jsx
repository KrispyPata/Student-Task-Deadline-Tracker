import { useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Container, Link, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../src/api'
import { saveAuth } from '../src/auth'

const AuthPage = ({ mode }) => {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        await apiRequest('/api/users', {
          method: 'POST',
          body: JSON.stringify(form),
        })
      }

      const auth = await apiRequest('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      saveAuth(auth)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {isRegister ? 'Start tracking assignments and deadlines.' : 'Sign in to view your tasks.'}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
            {isRegister && (
              <TextField name="name" label="Name" value={form.name} onChange={updateField} required />
            )}
            <TextField name="email" label="Email" type="email" value={form.email} onChange={updateField} required />
            <TextField name="password" label="Password" type="password" value={form.password} onChange={updateField} required inputProps={{ minLength: 6 }} />
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? 'Please wait…' : isRegister ? 'Register' : 'Login'}
            </Button>
          </Box>

          <Typography sx={{ mt: 3 }} textAlign="center">
            {isRegister ? 'Already have an account? ' : 'Need an account? '}
            <Link component="button" type="button" onClick={() => navigate(isRegister ? '/login' : '/register')}>
              {isRegister ? 'Login' : 'Register'}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}

export default AuthPage
