import SelectField, { Option as RawOption, SingleValue as RawSingleValue } from './SelectField'
import GatedIcon from '$/icons/GatedIcon'
import PrivateIcon from '$/icons/PrivateIcon'
import PublicIcon from '$/icons/PublicIcon'
import { PrivacyOption, PrivacySetting } from '$/types'
import { Props as SelectProps } from 'react-select'
import tw, { css } from 'twin.macro'
import Hint from './Hint'
import Text from './Text'
import Hodl from '$/components/Hodl'
import * as Config from '$/config.json'

export const PrivateRoomOption: PrivacyOption = {
    value: PrivacySetting.Private,
    label: 'Private',
    desc: 'Only invited members can post and view messages',
    icon: PrivateIcon,
}

export const PublicRoomOption: PrivacyOption = {
    value: PrivacySetting.Public,
    label: 'Public',
    desc: 'Anyone can view messages',
    icon: PublicIcon,
}

export const TokenGatedRoomOption: PrivacyOption = {
    value: PrivacySetting.TokenGated,
    label: Config.disableTokenGatedRoomCreation ? 'Coming soon: Token gated' : 'Token gated',
    desc: (
        <>
            Access granted only if you <Hodl /> a particular NFT or&nbsp;ERC&#8209;20 token
        </>
    ),
    icon: GatedIcon,
    disabled: Config.disableTokenGatedRoomCreation,
}

export const privacyOptions: PrivacyOption[] = [
    PrivateRoomOption,
    PublicRoomOption,
    TokenGatedRoomOption,
]

function isPrivacyOption(option: unknown): option is PrivacyOption {
    return !!option && typeof option === 'object'
}

export interface Props extends SelectProps {
    value: PrivacyOption
}

export default function PrivacySelectField({ value, ...props }: Props) {
    return (
        <SelectField
            {...props}
            options={privacyOptions}
            value={value}
            optionComponent={Option}
            singleValueComponent={SingleValue}
            isOptionDisabled={(option) => isPrivacyOption(option) && Boolean(option.disabled)}
        />
    )
}

function SingleValue({ data: { icon: Icon }, children, ...props }: any) {
    return (
        <RawSingleValue {...props}>
            <div
                css={tw`
                    text-[14px]
                    p-0
                    flex
                    items-center
                `}
            >
                <div
                    css={tw`
                        text-[#59799C]
                        flex
                        justify-center
                        w-10
                    `}
                >
                    <Icon css={tw`block`} />
                </div>
                <div>
                    <Text>{children}</Text>
                </div>
            </div>
        </RawSingleValue>
    )
}

function Option({ data: { label, icon: Icon, desc }, isDisabled, ...props }: any) {
    return (
        <RawOption {...props} isDisabled={isDisabled}>
            <div
                css={tw`
                    flex
                    items-center
                `}
            >
                <div
                    css={tw`
                        bg-[#F1F4F7]
                        rounded-full
                        w-8
                        h-8
                        flex
                        justify-center
                        items-center
                        mr-3
                        shrink-0
                    `}
                >
                    <Icon css={tw`block`} />
                </div>
                <div>
                    <div
                        css={[
                            tw`
                                text-[#36404E]
                                text-[14px]
                                font-medium
                            `,
                            isDisabled &&
                                css`
                                    color: inherit;
                                `,
                        ]}
                    >
                        <Text>{label}</Text>
                    </div>
                    <Hint
                        css={tw`
                            text-[0.75rem]
                            mt-0
                            pr-12
                        `}
                    >
                        <Text>{desc}</Text>
                    </Hint>
                </div>
            </div>
        </RawOption>
    )
}
