import App from '$/App'
import { screen, render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

jest.mock('streamr-client', () => ({
    __esModule: true,
    default: () => {
        // Do nothing.
    },
}))

describe('Getting into the app', () => {
    it('displays different wallet options in the wallet modal', async () => {
        render(<App />)

        act(() => {
            screen.getByText(/connect a wallet/i).click()
        })

        await screen.findByText(/select a wallet/i)

        screen.getAllByTestId(/walletoption-metamask/i)

        screen.getAllByTestId(/walletoption-coinbasewallet/i)

        screen.getAllByTestId(/walletoption-walletconnect/i)
    })
})
