import { configureStore } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import wallet, { WalletAction, walletSaga } from '$/features/wallet'
import delegation, { delegationSaga } from '$/features/delegation'
import room, { roomSaga } from '$/features/room'
import rooms, { roomsSaga } from '$/features/rooms'
import members, { membersSaga } from '$/features/members'
import member, { memberSaga } from '$/features/member'
import permission, { permissionSaga } from '$/features/permission'
import drafts, { draftsSaga } from '$/features/drafts'
import identicons, { identiconsSaga } from '$/features/identicons'
import clock from '$/features/clock'
import createSagaMiddleware from 'redux-saga'
import message, { messageSaga } from '$/features/message'
import { aliasSaga } from '$/features/alias'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: {
        clock,
        delegation,
        drafts,
        identicons,
        member,
        members,
        message,
        permission,
        room,
        rooms,
        wallet,
    },
    middleware(getDefaultMiddleware) {
        return [
            ...getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [WalletAction.setProvider.toString()],
                    ignoredPaths: ['wallet.provider', 'wallet.client', 'delegation.client'],
                },
            }),
            sagaMiddleware,
        ]
    },
})

sagaMiddleware.run(function* saga() {
    yield all([
        delegationSaga(),
        draftsSaga(),
        identiconsSaga(),
        memberSaga(),
        membersSaga(),
        messageSaga(),
        permissionSaga(),
        roomSaga(),
        roomsSaga(),
        walletSaga(),
        aliasSaga(),
    ])
})

export default store
