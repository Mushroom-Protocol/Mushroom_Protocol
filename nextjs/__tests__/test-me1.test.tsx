import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import TestMe1 from '../pages/test-me1'
 
describe('Page', () => {
  it('renders a heading', () => {
    render(<TestMe1 />)
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
  })
})