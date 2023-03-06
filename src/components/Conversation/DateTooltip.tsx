import Tooltip from '$/components/Tooltip'
import { I18n } from '$/utils/I18n'

interface Props {
    timestamp?: number
}

export default function DateTooltip({ timestamp }: Props) {
    if (typeof timestamp === 'undefined') {
        return <div />
    }

    return <Tooltip>{I18n.common.compactDate(timestamp)}</Tooltip>
}
