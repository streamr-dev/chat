import { PreflightParams } from '$/types'
import networkPreflight from './networkPreflight'
import requirePositiveBalance from './requirePositiveBalance'

export default async function preflight(params: PreflightParams) {
    await networkPreflight(params.provider)

    await requirePositiveBalance(params)
}
