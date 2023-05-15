import Text from '$/components/Text'
import i18n from '$/utils/i18n'
import tw from 'twin.macro'

export default function Credits({ tiny = false }: { tiny?: boolean }) {
    return (
        <div
            css={[
                tw`
                    bg-white
                    px-5
                    py-2.5
                    rounded-full
                    text-plug
                    shadow-sm
                    text-center
                    md:text-left
                    whitespace-nowrap
                `,
                tiny &&
                    tw`
                        px-3
                        py-1
                    `,
            ]}
        >
            <Text>
                {i18n('common.decentralizedBy')}&nbsp;
                <a
                    css={tw`!text-[#ff5924]`}
                    href="https://streamr.network"
                    rel="noreferrer noopener"
                    target="_blank"
                >
                    Streamr
                </a>
            </Text>
        </div>
    )
}
