import { I18n } from '$/utils/I18n'
import { css } from 'twin.macro'

export default function Hodl() {
    return (
        <span
            css={[
                css`
                    :hover span,
                    span + span {
                        display: none;
                    }

                    :hover span + span {
                        display: inline;
                    }
                `,
            ]}
        >
            <span>{I18n.common.holdLabel()}</span>
            <span>{I18n.common.holdLabel(true)}</span>
        </span>
    )
}
