import { AliasAction } from '$/features/alias'
import { Address } from '$/types'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import isBlank from '$/utils/isBlank'
import { error } from '$/utils/toaster'
import { takeEvery } from 'redux-saga/effects'

async function create(owner: Address, address: Address, value: string) {
    try {
        const now = Date.now()

        await db.aliases.add({
            createdAt: now,
            updatedAt: now,
            owner: owner.toLowerCase(),
            address: address.toLowerCase(),
            alias: value,
        })
    } catch (e) {
        error(`Failed to create a nickname.`)

        throw e
    }
}

async function destroy(owner: Address, address: Address) {
    try {
        await db.aliases
            .where({ owner: owner.toLowerCase(), address: address.toLowerCase() })
            .delete()
    } catch (e) {
        error(`Failed to remove a nickname.`)

        throw e
    }
}

async function update(owner: Address, address: Address, value: string) {
    let numModded = 0

    try {
        numModded = await db.aliases
            .where({ owner: owner.toLowerCase(), address: address.toLowerCase() })
            .modify({ alias: value, updatedAt: Date.now() })
    } catch (e) {
        error(`Failed to update a nickname.`)

        throw e
    }

    return numModded
}

export default function* set() {
    yield takeEvery(AliasAction.set, function* ({ payload: { owner, address, value } }) {
        try {
            if (isBlank(value)) {
                yield destroy(owner, address)
                return
            }

            const numModded: number = yield update(owner, address, value)

            if (numModded > 0) {
                return
            }

            yield create(owner, address, value)
        } catch (e) {
            handleError(e)
        }
    })
}
