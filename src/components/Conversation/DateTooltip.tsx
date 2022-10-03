import formatDate from '$/utils/formatDate'
import Tooltip from '$/components/Tooltip'

type Props = {
    className?: string
    timestamp: number | undefined
}

export default function DateTooltip({ timestamp }: Props) {
    if (!timestamp) {
        return <div />
    }

    return <Tooltip>{formatDate(timestamp)}</Tooltip>
}
