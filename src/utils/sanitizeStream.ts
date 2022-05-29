import { EnhancedStream, UnsafeStream } from '../../types/common'

export default function sanitizeStream(stream: UnsafeStream): EnhancedStream {
    if (!stream.extensions) {
        stream.extensions = {}
    }

    if (!stream.extensions['thechat.eth']) {
        stream.extensions['thechat.eth'] = {}
    }

    return stream as EnhancedStream
}
