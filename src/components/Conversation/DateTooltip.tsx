import Tooltip from '$/components/Tooltip'
import i18n from '$/utils/i18n'

interface Props {
    timestamp?: number
}

export default function DateTooltip({ timestamp }: Props) {
    if (typeof timestamp === 'undefined') {
        return <div />
    }

    return <Tooltip>{i18n('common.compactDate', timestamp)}</Tooltip>
}
