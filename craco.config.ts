import path from 'path'
import webpack from 'webpack'

const CracoConfig = {
    webpack: {
        alias: {
            'styled-components': path.resolve(__dirname, 'node_modules/styled-components'),
        },
        plugins: {
            add: [
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                })
            ],
        },
        configure({ resolve = {}, module: { rules, ...module }, ...config }: any) {
            const { fallback = {}, plugins = [] } = resolve

            return {
                ...config,
                module: {
                    ...module,
                    // Exclude `node_modules` from `source-map-loader`.
                    rules: rules.map((rule: any) => {
                        if (typeof rule.loader === 'string' && /source-map-loader/.test(rule.loader)) {
                            return {
                                ...rule,
                                exclude: /@babel(?:\/|\\{1,2})runtime|node_modules/,
                            }
                        }

                        return rule
                    }),
                },
                resolve: {
                    ...resolve,
                    // Remove plugin that limits importing to `src`.
                    plugins: plugins.filter(({ constructor }: any) => (
                        !constructor || constructor.name !== 'ModuleScopePlugin'
                    )),
                    fallback: {
                        ...fallback,
                        stream: false,
                        crypto: false
                    },
                },
            }
        },
    },
}

export default CracoConfig
