import { ReactNode } from 'react'
import { Helmet } from 'react-helmet'
import tw, { css } from 'twin.macro'
import Background from './background.png'
import pkg from '$/../package-lock.json'
import i18n from '$/utils/i18n'

interface Props {
    children?: ReactNode
    title?: string
}

export default function Page({ children, title = i18n('common.frontPageTitle') }: Props) {
    return (
        <>
            <Helmet title={title}>
                <meta name="@streamr/sdk" content={pkg.dependencies['@streamr/sdk'].version} />
            </Helmet>
            <main
                css={[
                    css`
                        background-image: url('${Background}');
                    `,
                    tw`
                        bg-center
                        bg-cover
                        bg-fixed
                        bg-no-repeat
                        h-screen
                        justify-center
                        w-screen
                    `,
                ]}
            >
                {children}
            </main>
        </>
    )
}
