import { MiscAction } from '$/features/misc'
import { selectNavigate } from '$/features/misc/selectors'
import { NavigateFunction } from 'react-router-dom'
import { select, takeEvery } from 'redux-saga/effects'

export default function* goto() {
    yield takeEvery(MiscAction.goto, function* ({ payload: to }) {
        const navigate: undefined | NavigateFunction = yield select(selectNavigate)

        if (typeof navigate === 'undefined') {
            console.warn('Misc: no navigate()')
            return
        }

        navigate(to)
    })
}
