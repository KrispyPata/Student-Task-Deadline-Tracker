import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import EventIcon from '@mui/icons-material/Event'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LoginIcon from '@mui/icons-material/Login'
import { useNavigate } from 'react-router-dom'
import { getAuth } from '../src/auth'
import logo from '../src/assets/node-nomads-logo.png'
import logo2 from '../src/assets/student-task-tracker-logo.png'

const LandingPage = () => {
  const navigate = useNavigate()
  const auth = getAuth()

  const features = [
    {
      title: 'Assignments',
      description:
        'Create assignments, set deadlines, track progress, and organize tasks by course.',
      icon: <AssignmentIcon sx={{ fontSize: 34 }} />,
    },
    {
      title: 'Courses',
      description:
        'Keep your subjects, schedules, course dates, and descriptions organized.',
      icon: <MenuBookIcon sx={{ fontSize: 34 }} />,
    },
    {
      title: 'Study Sessions',
      description:
        'Plan recurring study sessions and manage your academic schedule.',
      icon: <EventIcon sx={{ fontSize: 34 }} />,
    },
    {
      title: 'Reminders',
      description:
        'Create browser reminders so important assignments and deadlines are not forgotten.',
      icon: <NotificationsIcon sx={{ fontSize: 34 }} />,
    },
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f7f8fb',
      }}
    >
      {/* PUBLIC NAVIGATION */}
      <Box
        component="header"
        sx={{
          bgcolor: '#252b3a',
          borderBottom: '1px solid rgba(255,255,255,.08)',

          animation: 'headerEnter .45s ease both',

          '@keyframes headerEnter': {
            from: {
              opacity: 0,
              transform: 'translateY(-12px)',
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
        <Container maxWidth="lg">
          <Box
            sx={{
              minHeight: 76,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* BRAND */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.4}
              sx={{
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              <Box
                component="img"
                src={logo}
                alt="Node Nomads"
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: 'contain',

                  transition:
                    'transform .25s ease, filter .25s ease',

                  '&:hover': {
                    transform: 'scale(1.06)',
                    filter:
                      'drop-shadow(0 5px 10px rgba(255,64,87,.22))',
                  },

                  '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none',

                    '&:hover': {
                      transform: 'none',
                    },
                  },
                }}
              />

              <Box>
                <Typography
                  sx={{
                    color: '#fff',
                    fontWeight: 800,

                    fontSize: {
                      xs: '1rem',
                      sm: '1.25rem',
                    },

                    lineHeight: 1.1,
                  }}
                >
                  Student Task Tracker
                </Typography>

                <Typography
                  sx={{
                    mt: 0.3,
                    color: 'rgba(255,255,255,.55)',
                    fontSize: '.72rem',
                  }}
                >
                  by Node Nomads
                </Typography>
              </Box>
            </Stack>

            {/* NAV BUTTONS */}
            <Stack
              direction="row"
              spacing={1}
            >
              {auth?.token ? (
                <Button
                  variant="contained"
                  onClick={() =>
                    navigate('/dashboard')
                  }
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#ff4057',
                    textTransform: 'none',
                    fontWeight: 700,

                    transition:
                      'transform .2s ease, background-color .2s ease, box-shadow .2s ease',

                    '&:hover': {
                      bgcolor: '#e9364d',
                      transform: 'translateY(-2px)',
                      boxShadow:
                        '0 7px 18px rgba(255,64,87,.24)',
                    },

                    '@media (prefers-reduced-motion: reduce)': {
                      transition: 'none',

                      '&:hover': {
                        transform: 'none',
                      },
                    },
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() =>
                      navigate('/login')
                    }
                    sx={{
                      color: '#fff',
                      textTransform: 'none',

                      display: {
                        xs: 'none',
                        sm: 'inline-flex',
                      },

                      transition:
                        'transform .2s ease, background-color .2s ease',

                      '&:hover': {
                        transform: 'translateY(-1px)',
                        bgcolor:
                          'rgba(255,255,255,.06)',
                      },

                      '@media (prefers-reduced-motion: reduce)': {
                        transition: 'none',

                        '&:hover': {
                          transform: 'none',
                        },
                      },
                    }}
                  >
                    Sign In
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate('/register')
                    }
                    sx={{
                      bgcolor: '#ff4057',
                      textTransform: 'none',
                      fontWeight: 700,

                      transition:
                        'transform .2s ease, background-color .2s ease, box-shadow .2s ease',

                      '&:hover': {
                        bgcolor: '#e9364d',
                        transform: 'translateY(-2px)',

                        boxShadow:
                          '0 7px 18px rgba(255,64,87,.24)',
                      },

                      '@media (prefers-reduced-motion: reduce)': {
                        transition: 'none',

                        '&:hover': {
                          transform: 'none',
                        },
                      },
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* HERO */}
      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 5,
            md: 9,
          },

          animation: 'pageEnter .55s ease both',

          '@keyframes pageEnter': {
            from: {
              opacity: 0,
              transform: 'translateY(18px)',
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
        <Box
          sx={{
            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',
              md: '1.05fr .95fr',
            },

            alignItems: 'center',

            gap: {
              xs: 5,
              md: 8,
            },
          }}
        >
          {/* HERO TEXT */}
          <Box
            sx={{
              animation: 'heroTextEnter .6s ease .08s both',

              '@keyframes heroTextEnter': {
                from: {
                  opacity: 0,
                  transform: 'translateX(-20px)',
                },

                to: {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },

              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
              },
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: '#ff4057',
                fontWeight: 800,
                letterSpacing: 1.8,
              }}
            >
              Your academic command center
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: '#252b3a',
                fontWeight: 900,
                lineHeight: 1.05,

                fontSize: {
                  xs: '2.7rem',
                  md: '4.3rem',
                },
              }}
            >
              Stay organized.

              <Box
                component="span"
                sx={{
                  display: 'block',
                  color: '#ff4057',
                }}
              >
                Meet every deadline.
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 3,
                maxWidth: 650,
                color: '#697083',
                lineHeight: 1.8,

                fontSize: {
                  xs: '1rem',
                  md: '1.15rem',
                },
              }}
            >
              Student Task Tracker helps students manage
              assignments, courses, study sessions, reminders,
              deadlines, and academic progress from one
              application.
            </Typography>

            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={1.5}
              sx={{ mt: 4 }}
            >
              {auth?.token ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() =>
                    navigate('/dashboard')
                  }
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#ff4057',
                    px: 3,
                    py: 1.3,
                    textTransform: 'none',
                    fontWeight: 800,

                    transition:
                      'transform .2s ease, box-shadow .2s ease, background-color .2s ease',

                    '&:hover': {
                      bgcolor: '#e9364d',
                      transform: 'translateY(-2px)',

                      boxShadow:
                        '0 9px 22px rgba(255,64,87,.24)',
                    },

                    '@media (prefers-reduced-motion: reduce)': {
                      transition: 'none',

                      '&:hover': {
                        transform: 'none',
                      },
                    },
                  }}
                >
                  Open Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() =>
                      navigate('/register')
                    }
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: '#ff4057',
                      px: 3,
                      py: 1.3,
                      textTransform: 'none',
                      fontWeight: 800,

                      transition:
                        'transform .2s ease, box-shadow .2s ease, background-color .2s ease',

                      '&:hover': {
                        bgcolor: '#e9364d',
                        transform: 'translateY(-2px)',

                        boxShadow:
                          '0 9px 22px rgba(255,64,87,.24)',
                      },

                      '@media (prefers-reduced-motion: reduce)': {
                        transition: 'none',

                        '&:hover': {
                          transform: 'none',
                        },
                      },
                    }}
                  >
                    Get Started
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() =>
                      navigate('/login')
                    }
                    startIcon={<LoginIcon />}
                    sx={{
                      px: 3,
                      py: 1.3,

                      borderColor: '#252b3a',
                      color: '#252b3a',

                      textTransform: 'none',
                      fontWeight: 700,

                      transition:
                        'transform .2s ease, background-color .2s ease',

                      '&:hover': {
                        borderColor: '#252b3a',
                        bgcolor:
                          'rgba(37,43,58,.04)',

                        transform:
                          'translateY(-2px)',
                      },

                      '@media (prefers-reduced-motion: reduce)': {
                        transition: 'none',

                        '&:hover': {
                          transform: 'none',
                        },
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </Stack>
          </Box>

          {/* HERO LOGO */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',

              animation:
                'heroLogoEnter .7s ease .18s both',

              '@keyframes heroLogoEnter': {
                from: {
                  opacity: 0,
                  transform:
                    'translateX(22px) scale(.96)',
                },

                to: {
                  opacity: 1,
                  transform:
                    'translateX(0) scale(1)',
                },
              },

              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
              },
            }}
          >
            <Box
              component="img"
              src={logo2}
              alt="Student Task Tracker"
              sx={{
                width: {
                  xs: 260,
                  sm: 340,
                  md: 430,
                },

                maxWidth: '200%',
                objectFit: 'contain',

                filter:
                  'drop-shadow(0 24px 38px rgba(37,43,58,.15))',

                animation:
                  'logoFloat 4s ease-in-out infinite',

                '@keyframes logoFloat': {
                  '0%, 100%': {
                    transform: 'translateY(0)',
                  },

                  '50%': {
                    transform:
                      'translateY(-8px)',
                  },
                },

                '@media (prefers-reduced-motion: reduce)': {
                  animation: 'none',
                },
              }}
            />
          </Box>
        </Box>

        {/* FEATURE LIST */}
        <Box
          sx={{
            mt: {
              xs: 7,
              md: 10,
            },

            animation:
              'featuresHeadingEnter .55s ease .25s both',

            '@keyframes featuresHeadingEnter': {
              from: {
                opacity: 0,
                transform: 'translateY(15px)',
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
          <Typography
            variant="h4"
            sx={{
              color: '#252b3a',
              fontWeight: 800,
              textAlign: 'center',
            }}
          >
            Everything students need in one place
          </Typography>

          <Typography
            sx={{
              mt: 1,
              mb: 4,
              color: '#697083',
              textAlign: 'center',
            }}
          >
            Organize the most important parts of your academic workload.
          </Typography>

          <Box
            sx={{
              display: 'grid',

              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              },

              gap: 2,
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                sx={{
                  height: '100%',

                  borderTop:
                    '4px solid #ff4057',

                  animation:
                    `featureEnter .45s ease ${0.35 + index * 0.08}s both`,

                  transition:
                    'transform .22s ease, box-shadow .22s ease',

                  '&:hover': {
                    transform: 'translateY(-5px)',

                    boxShadow:
                      '0 14px 32px rgba(37,43,58,.12)',
                  },

                  '@keyframes featureEnter': {
                    from: {
                      opacity: 0,
                      transform:
                        'translateY(18px)',
                    },

                    to: {
                      opacity: 1,
                      transform:
                        'translateY(0)',
                    },
                  },

                  '@media (prefers-reduced-motion: reduce)': {
                    animation: 'none',
                    transition: 'none',

                    '&:hover': {
                      transform: 'none',
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 58,
                      height: 58,

                      display: 'grid',
                      placeItems: 'center',

                      borderRadius: 3,

                      bgcolor:
                        'rgba(255,64,87,.09)',

                      color: '#ff4057',

                      mb: 2,

                      transition:
                        'transform .22s ease, background-color .22s ease',

                      '.MuiCard-root:hover &': {
                        transform:
                          'scale(1.08)',

                        bgcolor:
                          'rgba(255,64,87,.14)',
                      },

                      '@media (prefers-reduced-motion: reduce)': {
                        transition: 'none',
                      },
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: '#252b3a',
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      color: '#697083',
                      lineHeight: 1.65,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center',
          bgcolor: '#252b3a',
          color: 'rgba(255,255,255,.6)',
        }}
      >
        <Typography variant="body2">
          Student Task Tracker · Node Nomads
        </Typography>
      </Box>
    </Box>
  )
}

export default LandingPage