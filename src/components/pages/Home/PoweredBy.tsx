import tw from 'twin.macro'
import Text from '../../Text'

export default function PoweredBy() {
    return (
        <div
            css={[
                tw`
                    -translate-x-1/2
                    absolute
                    bg-[#ffffff]
                    bottom-5
                    left-1/2
                    px-5
                    py-[10px]
                    rounded-[50px]
                    text-center
                    text-plug
                    w-[90%]
                    shadow-sm
                    md:left-5
                    md:text-left
                    md:translate-x-0
                    md:w-auto
                `,
            ]}
        >
            <Text>
                Decentralised, encrypted chat powered by&nbsp;
                <a
                    css={[
                        tw`
                    !text-[#ff5924]
                `,
                    ]}
                    href="https://streamr.network"
                    rel="noreferrer"
                    target="_blank"
                >
                    Streamr
                </a>
            </Text>
        </div>
    )
}
