import { useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import EventIcon from '@mui/icons-material/Event'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  clearAuth,
  getAuth,
} from '../src/auth'
import logo from '../src/assets/node-nomads-logo.png'

const AppNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = getAuth()

  const [mobileOpen, setMobileOpen] =
    useState(false)

  const links = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
    },
    {
      label: 'Courses',
      path: '/courses',
      icon: <MenuBookIcon />,
    },
    {
      label: 'Sessions',
      path: '/sessions',
      icon: <EventIcon />,
    },
    {
      label: 'Reminders',
      path: '/reminders',
      icon: <NotificationsIcon />,
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: <PersonIcon />,
    },
  ]

  const isActive = (path) =>
    location.pathname === path

  const goTo = (path) => {
    navigate(path)
    setMobileOpen(false)
  }

  const logout = () => {
    clearAuth()
    setMobileOpen(false)
    navigate('/login')
  }

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: '#252b3a',
          borderBottom:
            '1px solid rgba(255,255,255,.08)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: 68,
              md: 76,
            },

            px: {
              xs: 2,
              md: 4,
            },

            gap: {
              xs: 1,
              md: 3,
            },

            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* BRAND */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.1}
            sx={{
              cursor: 'pointer',
              flexShrink: 0,
              minWidth: 0,
            }}
            onClick={() => navigate('/')}
          >
            <Box
              component="img"
              src={logo}
              alt="Student Task Tracker"
              sx={{
                width: {
                  xs: 44,
                  sm: 48,
                },
                height: {
                  xs: 44,
                  sm: 48,
                },
                objectFit: 'contain',
                bgcolor: 'transparent',
                flexShrink: 0,
              }}
            />

            <Box
              sx={{
                display: {
                  xs: 'block',
                  md: 'none',
                  lg: 'block',
                },
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: {
                    xs: '.95rem',
                    sm: '1.05rem',
                    lg: '1.15rem',
                  },
                  lineHeight: 1.05,

                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',

                  maxWidth: {
                    xs: 190,
                    sm: 260,
                    lg: 'none',
                  },
                }}
              >
                Student Task Tracker
              </Typography>

              <Typography
                sx={{
                  color:
                    'rgba(255,255,255,.55)',
                  fontSize: '.68rem',
                  mt: 0.25,

                  display: {
                    xs: 'none',
                    sm: 'block',
                  },
                }}
              >
                by Node Nomads
              </Typography>
            </Box>
          </Stack>

          {/* DESKTOP NAVIGATION */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },

              flexGrow: 1,
              justifyContent: 'center',
              minWidth: 0,
            }}
          >
            {links.map((link) => {
              const active = isActive(
                link.path,
              )

              return (
                <Button
                  key={link.path}
                  startIcon={link.icon}
                  onClick={() =>
                    navigate(link.path)
                  }
                  sx={{
                    color: active
                      ? '#fff'
                      : 'rgba(255,255,255,.65)',

                    bgcolor: active
                      ? 'rgba(255,64,87,.18)'
                      : 'transparent',

                    borderRadius: 2,

                    px: {
                      md: 1,
                      lg: 1.5,
                    },

                    minWidth: 0,

                    fontSize: {
                      md: '.78rem',
                      lg: '.875rem',
                    },

                    textTransform: 'none',

                    fontWeight: active
                      ? 700
                      : 500,

                    whiteSpace: 'nowrap',

                    transition:
                      'background-color .2s ease, color .2s ease, transform .2s ease',

                    '&:hover': {
                      bgcolor:
                        'rgba(255,64,87,.14)',
                      color: '#fff',
                      transform:
                        'translateY(-1px)',
                    },
                  }}
                >
                  {link.label}
                </Button>
              )
            })}
          </Stack>

          {/* DESKTOP USER / LOGOUT */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.2}
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: {
                  md: 'none',
                  lg: 'block',
                },
                textAlign: 'right',
              }}
            >
              <Typography
                sx={{
                  color: '#fff',
                  fontSize: '.85rem',
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                {auth?.user?.name}
              </Typography>

              <Typography
                sx={{
                  color:
                    'rgba(255,255,255,.5)',
                  fontSize: '.66rem',
                  mt: 0.25,
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
                border:
                  '1px solid rgba(255,255,255,.12)',
                width: 40,
                height: 40,

                transition:
                  'background-color .2s ease, transform .2s ease',

                '&:hover': {
                  bgcolor: '#ff4057',
                  transform:
                    'translateY(-1px)',
                },
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Stack>

          {/* MOBILE MENU BUTTON */}
          <Box
            sx={{
              display: {
                xs: 'block',
                md: 'none',
              },
              ml: 'auto',
            }}
          >
            <IconButton
              onClick={() =>
                setMobileOpen(true)
              }
              aria-label="Open navigation menu"
              sx={{
                color: '#fff',

                width: 42,
                height: 42,

                border:
                  '1px solid rgba(255,255,255,.12)',

                bgcolor:
                  'rgba(255,255,255,.04)',

                '&:hover': {
                  bgcolor:
                    'rgba(255,64,87,.18)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
        PaperProps={{
          sx: {
            width: {
              xs: 285,
              sm: 320,
            },

            bgcolor: '#252b3a',
            color: '#fff',

            borderLeft:
              '1px solid rgba(255,255,255,.08)',
          },
        }}
      >
        <Box
          sx={{
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* DRAWER HEADER */}
          <Box
            sx={{
              px: 2.5,
              py: 2.25,

              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',

              borderBottom:
                '1px solid rgba(255,255,255,.08)',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                cursor: 'pointer',
              }}
              onClick={() =>
                goTo('/')
              }
            >
              <Box
                component="img"
                src={logo}
                alt="Student Task Tracker"
                sx={{
                  width: 42,
                  height: 42,
                  objectFit: 'contain',
                }}
              />

              <Box>
                <Typography
                  sx={{
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '.95rem',
                    lineHeight: 1.05,
                  }}
                >
                  Student Task Tracker
                </Typography>

                <Typography
                  sx={{
                    color:
                      'rgba(255,255,255,.5)',
                    fontSize: '.66rem',
                    mt: 0.3,
                  }}
                >
                  by Node Nomads
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={() =>
                setMobileOpen(false)
              }
              sx={{
                color:
                  'rgba(255,255,255,.8)',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* USER */}
          <Box
            sx={{
              px: 2.5,
              py: 2,

              bgcolor:
                'rgba(255,255,255,.03)',

              borderBottom:
                '1px solid rgba(255,255,255,.08)',
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 700,
                fontSize: '.95rem',
              }}
            >
              {auth?.user?.name ||
                'Student'}
            </Typography>

            <Typography
              sx={{
                mt: 0.25,

                color:
                  'rgba(255,255,255,.5)',

                fontSize: '.72rem',
              }}
            >
              Student account
            </Typography>
          </Box>

          {/* MOBILE NAVIGATION */}
          <List
            sx={{
              px: 1.5,
              py: 2,
            }}
          >
            {links.map((link) => {
              const active = isActive(
                link.path,
              )

              return (
                <ListItemButton
                  key={link.path}
                  onClick={() =>
                    goTo(link.path)
                  }
                  selected={active}
                  sx={{
                    mb: 0.5,

                    borderRadius: 2,

                    color: active
                      ? '#fff'
                      : 'rgba(255,255,255,.68)',

                    bgcolor: active
                      ? 'rgba(255,64,87,.18)'
                      : 'transparent',

                    transition:
                      'background-color .2s ease, transform .2s ease',

                    '&.Mui-selected': {
                      bgcolor:
                        'rgba(255,64,87,.18)',
                    },

                    '&.Mui-selected:hover': {
                      bgcolor:
                        'rgba(255,64,87,.24)',
                    },

                    '&:hover': {
                      bgcolor:
                        'rgba(255,255,255,.06)',
                      transform:
                        'translateX(2px)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,

                      color: active
                        ? '#ff7180'
                        : 'rgba(255,255,255,.6)',
                    }}
                  >
                    {link.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontWeight: active
                        ? 700
                        : 500,
                    }}
                  />
                </ListItemButton>
              )
            })}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <Divider
            sx={{
              borderColor:
                'rgba(255,255,255,.08)',
            }}
          />

          {/* LOGOUT */}
          <Box
            sx={{
              p: 1.5,
            }}
          >
            <ListItemButton
              onClick={logout}
              sx={{
                borderRadius: 2,

                color: '#ff7180',

                '&:hover': {
                  bgcolor:
                    'rgba(255,64,87,.12)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: '#ff7180',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>

              <ListItemText
                primary="Log out"
                primaryTypographyProps={{
                  fontWeight: 700,
                }}
              />
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

export default AppNavigation