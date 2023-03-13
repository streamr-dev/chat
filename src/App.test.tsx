import App from '$/App'
import { render } from '@testing-library/react'

jest.mock('streamr-client', () => ({
    __esModule: true,
    default: () => {
        // Do nothing.
    },
}))

describe('Getting into the app', () => {
    it('works', () => {
        render(<App />)
    })
})
