import { render, screen } from '@testing-library/react'
import App from './App'

jest.mock('streamr-client', () => ({}))

test('renders learn react link', () => {
    render(<App />)
    expect(screen.getByText(/hello world/i)).toBeInTheDocument()
})
