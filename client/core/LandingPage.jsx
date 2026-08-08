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
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.4}
            >
              <Box
                component="img"
                src={logo}
                alt="Student Task Tracker"
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: 'contain',
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

            <Stack
              direction="row"
              spacing={1}
            >
              {auth?.token ? (
                <Button
                  variant="contained"
                  onClick={() => navigate('/dashboard')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#ff4057',
                    textTransform: 'none',
                    fontWeight: 700,

                    '&:hover': {
                      bgcolor: '#e9364d',
                    },
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => navigate('/login')}
                    sx={{
                      color: '#fff',
                      textTransform: 'none',
                      display: {
                        xs: 'none',
                        sm: 'inline-flex',
                      },
                    }}
                  >
                    Sign In
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{
                      bgcolor: '#ff4057',
                      textTransform: 'none',
                      fontWeight: 700,

                      '&:hover': {
                        bgcolor: '#e9364d',
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
          <Box>
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
                  onClick={() => navigate('/dashboard')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#ff4057',
                    px: 3,
                    py: 1.3,
                    textTransform: 'none',
                    fontWeight: 800,

                    '&:hover': {
                      bgcolor: '#e9364d',
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
                    onClick={() => navigate('/register')}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: '#ff4057',
                      px: 3,
                      py: 1.3,
                      textTransform: 'none',
                      fontWeight: 800,

                      '&:hover': {
                        bgcolor: '#e9364d',
                      },
                    }}
                  >
                    Get Started
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    startIcon={<LoginIcon />}
                    sx={{
                      px: 3,
                      py: 1.3,
                      borderColor: '#252b3a',
                      color: '#252b3a',
                      textTransform: 'none',
                      fontWeight: 700,

                      '&:hover': {
                        borderColor: '#252b3a',
                        bgcolor: 'rgba(37,43,58,.04)',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </Stack>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
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
            {features.map((feature) => (
              <Card
                key={feature.title}
                sx={{
                  height: '100%',
                  borderTop: '4px solid #ff4057',
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
                      bgcolor: 'rgba(255,64,87,.09)',
                      color: '#ff4057',
                      mb: 2,
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