import { ToastType } from '$/components/Toast'
import { AliasAction } from '$/features/alias'
import toast from '$/features/toaster/helpers/toast'
import { Address } from '$/types'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import i18n from '$/utils/I18n'
import isBlank from '$/utils/isBlank'
import { call } from 'redux-saga/effects'

async function create(owner: Address, address: Address, value: string) {
    const now = Date.now()

    await db.aliases.add({
        createdAt: now,
        updatedAt: now,
        owner: owner.toLowerCase(),
        address: address.toLowerCase(),
        alias: value,
    })
}

async function destroy(owner: Address, address: Address) {
    await db.aliases.where({ owner: owner.toLowerCase(), address: address.toLowerCase() }).delete()
}

async function update(owner: Address, address: Address, value: string) {
    return db.aliases
        .where({ owner: owner.toLowerCase(), address: address.toLowerCase() })
        .modify({ alias: value, updatedAt: Date.now() })
}

export default function setAlias({
    owner,
    address,
    value,
}: ReturnType<typeof AliasAction.set>['payload']) {
    return call(function* () {
        try {
            if (isBlank(value)) {
                try {
                    yield destroy(owner, address)
                } catch (e) {
                    yield toast({
                        title: i18n('aliasToast.failedToDestroy'),
                        type: ToastType.Error,
                    })

                    throw e
                }

                return
            }

            try {
                const numModded: number = yield update(owner, address, value)

                if (numModded > 0) {
                    return
                }
            } catch (e) {
                yield toast({
                    title: i18n('aliasToast.failedToUpdate'),
                    type: ToastType.Error,
                })

                throw e
            }

            try {
                yield create(owner, address, value)
            } catch (e) {
                yield toast({
                    title: i18n('aliasToast.failedToCreate'),
                    type: ToastType.Error,
                })

                throw e
            }
        } catch (e) {
            handleError(e)
        }
    })
}
