import pathnameToRoomIdPartials from './pathnameToRoomIdPartials'

describe('pathnameToRoomIdPartials', () => {
    it('forwards invalid room id "as is"', () => {
        expect(pathnameToRoomIdPartials('whatever')).toEqual('whatever')
    })

    it('returns a partials object for valid room id', () => {
        expect(
            pathnameToRoomIdPartials('0x1234123412341234123412341234123412341234~some-uuid')
        ).toEqual({ account: '0x1234123412341234123412341234123412341234', uuid: 'some-uuid' })

        expect(
            pathnameToRoomIdPartials(
                '0x1234123412341234123412341234123412341234/streamr-chat/room/some-uuid'
            )
        ).toEqual({ account: '0x1234123412341234123412341234123412341234', uuid: 'some-uuid' })
    })
})
