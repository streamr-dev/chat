import { AliasAction } from '$/features/alias'
import { Address } from '$/types'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import isBlank from '$/utils/isBlank'
import { error, success } from '$/utils/toaster'
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

        success(`Nickname for ${address} created.`)
    } catch (e) {
        error(`Failed to create a nickname for ${address}.`)

        throw e
    }
}

async function destroy(owner: Address, address: Address) {
    try {
        const numDeleted = await db.aliases
            .where({ owner: owner.toLowerCase(), address: address.toLowerCase() })
            .delete()

        if (numDeleted > 0) {
            success(`Removed a nickname for ${address}.`)
        }
    } catch (e) {
        error(`Failed to remove a nickname for ${address}.`)

        throw e
    }
}

async function update(owner: Address, address: Address, value: string) {
    let numModded = 0

    try {
        numModded = await db.aliases
            .where({ owner: owner.toLowerCase(), address: address.toLowerCase() })
            .modify({ alias: value, updatedAt: Date.now() })

        if (numModded > 0) {
            success(`Updated a nickname for ${address}.`)
        }
    } catch (e) {
        error(`Failed to update a nickname for ${address}.`)

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
