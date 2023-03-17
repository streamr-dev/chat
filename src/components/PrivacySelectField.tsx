import SelectField, { Option as RawOption, SingleValue as RawSingleValue } from './SelectField'
import { PrivacyOption, PrivacySetting } from '$/types'
import { Props as SelectProps } from 'react-select'
import tw, { css } from 'twin.macro'
import Hint from './Hint'
import Text from './Text'
import i18n from '$/utils/i18n'

export const PrivateRoomOption: PrivacyOption = {
    value: PrivacySetting.Private,
}

export const PublicRoomOption: PrivacyOption = {
    value: PrivacySetting.Public,
}

export const TokenGatedRoomOption: PrivacyOption = {
    value: PrivacySetting.TokenGated,
}

export const privacyOptions: PrivacyOption[] = [
    PrivateRoomOption,
    PublicRoomOption,
    TokenGatedRoomOption,
]

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
            getOptionLabel={({ value }: any) => i18n('common.roomPrivacyLabel', value)}
        />
    )
}

function SingleValue({ data: { value }, children, ...props }: any) {
    const Icon = i18n('common.roomPrivacyIcon', value)

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

function Option({ data: { value }, isDisabled, ...props }: any) {
    const Icon = i18n('common.roomPrivacyIcon', value)

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
                        <Text>{i18n('common.roomPrivacyLabel', value)}</Text>
                    </div>
                    <Hint
                        css={tw`
                            text-[0.75rem]
                            mt-0
                            pr-12
                        `}
                    >
                        <Text>{i18n('common.roomPrivacyDesc', value)}</Text>
                    </Hint>
                </div>
            </div>
        </RawOption>
    )
}
