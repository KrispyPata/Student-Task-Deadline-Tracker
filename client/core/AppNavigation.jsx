import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import EventIcon from '@mui/icons-material/Event'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'
import { useLocation, useNavigate } from 'react-router-dom'
import { clearAuth, getAuth } from '../src/auth'
import logo from '../src/assets/node-nomads-logo.png'

const AppNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = getAuth()

  const links = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      label: 'Courses',
      path: '/courses',
      icon: <MenuBookIcon fontSize="small" />,
    },
    {
      label: 'Sessions',
      path: '/sessions',
      icon: <EventIcon fontSize="small" />,
    },
    {
      label: 'Reminders',
      path: '/reminders',
      icon: <NotificationsIcon fontSize="small" />,
    },
  ]

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: '#252b3a',
        borderBottom: '1px solid rgba(255,255,255,.08)',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 76,
          px: {
            xs: 2,
            md: 4,
          },
          gap: 3,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.2}
          sx={{
            cursor: 'pointer',
            flexShrink: 0,
          }}
          onClick={() => navigate('/')}
        >
          <Box
            component="img"
            src={logo}
            alt="Student Task Tracker"
            sx={{
              width: 48,
              height: 48,
              objectFit: 'contain',
              bgcolor: 'transparent',
            }}
          />

          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
              },
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 800,
                fontSize: '1.15rem',
                lineHeight: 1.1,
              }}
            >
              Student Task Tracker
            </Typography>

            <Typography
              sx={{
                color: 'rgba(255,255,255,.55)',
                fontSize: '.72rem',
                mt: 0.3,
              }}
            >
              by Node Nomads
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={0.6}
          sx={{
            flexGrow: 1,
            overflowX: 'auto',
            justifyContent: {
              xs: 'flex-start',
              md: 'center',
            },

            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {links.map((link) => {
            const active =
              link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path)

            return (
              <Button
                key={link.path}
                startIcon={link.icon}
                onClick={() => navigate(link.path)}
                sx={{
                  color: active
                    ? '#fff'
                    : 'rgba(255,255,255,.65)',
                  bgcolor: active
                    ? 'rgba(255,64,87,.18)'
                    : 'transparent',
                  borderRadius: 2,
                  px: 1.6,
                  textTransform: 'none',
                  fontWeight: active ? 700 : 500,
                  whiteSpace: 'nowrap',

                  '&:hover': {
                    bgcolor: 'rgba(255,64,87,.14)',
                    color: '#fff',
                  },
                }}
              >
                {link.label}
              </Button>
            )
          })}
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.3}
          sx={{ flexShrink: 0 }}
        >
          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'block',
              },
              textAlign: 'right',
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontSize: '.88rem',
                fontWeight: 700,
              }}
            >
              {auth?.user?.name}
            </Typography>

            <Typography
              sx={{
                color: 'rgba(255,255,255,.5)',
                fontSize: '.68rem',
              }}
            >
              Student
            </Typography>
          </Box>

          <IconButton
            onClick={logout}
            aria-label="Log out"
            sx={{
              color: '#fff',
              border: '1px solid rgba(255,255,255,.12)',
              width: 40,
              height: 40,

              '&:hover': {
                bgcolor: '#ff4057',
              },
            }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default AppNavigation