import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import LandingPage from '../LandingPage'

const renderLandingPage = () => {
  render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>,
  )
}

describe('LandingPage', () => {
  it('displays the Student Task Tracker heading', () => {
    renderLandingPage()

    expect(
      screen.getByText(/Meet every deadline/i),
    ).toBeInTheDocument()
  })

  it('displays the main application features', () => {
    renderLandingPage()

    expect(
      screen.getByText('Assignments'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Courses'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Study Sessions'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Reminders'),
    ).toBeInTheDocument()
  })
})