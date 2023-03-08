import i18n from '$/utils/i18n'
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
            <span>{i18n('common.holdLabel')}</span>
            <span>{i18n('common.holdLabel', true)}</span>
        </span>
    )
}
