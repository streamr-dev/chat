import StreamrClient, { StreamrClientConfig } from 'streamr-client'

export default function getNewStreamrClient(auth: StreamrClientConfig['auth']) {
    return new StreamrClient({
        auth,
        gapFill: false,
        encryption: {
            litProtocolEnabled: true,
            litProtocolLogging: false,
        },
    })
}
