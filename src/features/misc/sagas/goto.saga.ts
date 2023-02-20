import { MiscAction } from '$/features/misc'
import { selectNavigate } from '$/features/misc/selectors'
import pathnameToRoomIdPartials from '$/utils/pathnameToRoomIdPartials'
import { NavigateFunction } from 'react-router-dom'
import { select, takeEvery } from 'redux-saga/effects'

export default function* goto() {
    yield takeEvery(MiscAction.goto, function* ({ payload }) {
        const navigate: undefined | NavigateFunction = yield select(selectNavigate)

        if (typeof navigate === 'undefined') {
            console.warn('Misc: no navigate()')
            return
        }

        const partials = pathnameToRoomIdPartials(payload)

        const to =
            typeof partials === 'string' ? `/${partials}` : `/${partials.account}~${partials.uuid}`

        navigate(to)
    })
}
