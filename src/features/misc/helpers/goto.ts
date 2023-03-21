import { selectNavigate } from '$/features/misc/selectors'
import pathnameToRoomIdPartials from '$/utils/pathnameToRoomIdPartials'
import { NavigateFunction } from 'react-router-dom'
import { call, select } from 'redux-saga/effects'

export default function goto(pathname: string) {
    return call(function* () {
        const navigate: undefined | NavigateFunction = yield select(selectNavigate)

        if (typeof navigate === 'undefined') {
            console.warn('Misc: no navigate()')
            return
        }

        const partials = pathnameToRoomIdPartials(pathname)

        const to =
            typeof partials === 'string' ? `/${partials}` : `/${partials.account}~${partials.uuid}`

        navigate(to)
    })
}
