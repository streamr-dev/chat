import { Flag } from '$/features/flag/types'

describe('Flag', () => {
    describe('isFetchingTokenMetadata', () => {
        it('formats proper flag key', () => {
            expect(Flag.isFetchingTokenMetadata('0x1AB', [])).toEqual(
                '["isFetchingTokenMetadata","0x1ab"]'
            )

            expect(Flag.isFetchingTokenMetadata('0x1AB', ['1', '3', '2'])).toEqual(
                '["isFetchingTokenMetadata","0x1ab","1","2","3"]'
            )
        })
    })
})
