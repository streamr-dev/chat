import db from '$/utils/db'
import { PromiseExtended } from 'dexie'
import { runSaga } from 'redux-saga'
import setAlias from './setAlias'

const owner = '0x01'

const address = '0x02'

function repromisify<T extends PromiseExtended>(promise: T) {
    return new Promise<Awaited<T>>((resolve, reject) => {
        promise.then(resolve, reject)
    })
}

describe('setAlias', () => {
    beforeEach(() => db.aliases.clear())

    it('creates an alias', async () => {
        await expect(repromisify(db.aliases.count())).resolves.toBe(0)

        await runSaga({}, function* () {
            yield setAlias({ owner, address, value: 'Foo' })
        }).toPromise()

        await expect(
            repromisify(
                db.aliases
                    .where({ owner, address })
                    .first()
                    .then((alias) => alias?.alias)
            )
        ).resolves.toEqual('Foo')
    })

    it('updates an alias', async () => {
        const now = Date.now()

        await db.aliases.add({
            createdAt: now,
            updatedAt: now,
            owner,
            address,
            alias: 'Oldfoo',
        })

        await expect(
            repromisify(
                db.aliases
                    .where({ owner, address })
                    .first()
                    .then((alias) => alias?.alias)
            )
        ).resolves.toEqual('Oldfoo')

        await runSaga({}, function* () {
            yield setAlias({ owner, address, value: 'Newfoo' })
        }).toPromise()

        await expect(
            repromisify(
                db.aliases
                    .where({ owner, address })
                    .first()
                    .then((alias) => alias?.alias)
            )
        ).resolves.toEqual('Newfoo')
    })

    it('removes an alias', async () => {
        const now = Date.now()

        await db.aliases.add({
            createdAt: now,
            updatedAt: now,
            owner,
            address,
            alias: 'Foo',
        })

        await expect(repromisify(db.aliases.count())).resolves.toBe(1)

        await runSaga({}, function* () {
            yield setAlias({ owner, address, value: '' })
        }).toPromise()

        await expect(repromisify(db.aliases.count())).resolves.toBe(0)
    })
})
