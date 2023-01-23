import { ReactNode } from 'react'
import { Helmet } from 'react-helmet'
import tw, { css } from 'twin.macro'
import Background from './background.png'
import pkg from '$/../package-lock.json'

type Props = {
    children?: ReactNode
    title?: string
}

export default function Page({ children, title = 'Streamr Chat dApp' }: Props) {
    return (
        <>
            <Helmet title={title}>
                <meta name="streamr-client" content={pkg.dependencies['streamr-client'].version} />
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
