import formatDate from '$/utils/formatDate'
import Tooltip from '$/components/Tooltip'

interface Props {
    timestamp?: number
}

export default function DateTooltip({ timestamp }: Props) {
    if (typeof timestamp === 'undefined') {
        return <div />
    }

    return <Tooltip>{formatDate(timestamp)}</Tooltip>
}
