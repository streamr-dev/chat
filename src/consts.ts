import uniqueId from 'lodash/uniqueId'

export const ZeroAddress = '0x0000000000000000000000000000000000000000'

export const ERC20PolicyFactoryAddress = '0xe7e27Fa91e705445BE035ff3C4F09cA52EDF7EB1'

export const ERC721PolicyFactoryAddress = '0x8308703B50134f7151fb6609439E3e09a5b258a3'

export const ERC777PolicyFactoryAddress = '0xa8275A182196C13B1411ab67E96C8f2130a4bC53'

export const ERC1155PolicyFactoryAddress = '0xDe9521243E6045f35019A2324fF363Ce47fa9B8F'

export const JoinPolicyRegistryAddress = '0x8b3D38Ad6568eb4146A93b2a0da40174B3841213'

export enum PermissionType {
    Edit = 0,
    Delete,
    Publish,
    Subscribe,
    Grant,
}

export const JSON_RPC_URL = 'https://polygon-rpc.com'

export const Layer = {
    Modal: uniqueId('modals-'),
    Toast: uniqueId('toasts-'),
}
