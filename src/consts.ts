import uniqueId from 'lodash/uniqueId'

export const ZeroAddress = '0x0000000000000000000000000000000000000000'

export const ERC20PolicyFactoryAddress = '0xe7e27Fa91e705445BE035ff3C4F09cA52EDF7EB1'

export const ERC721PolicyFactoryAddress = '0x3B60100BEcCF61f915BfC9e0a029F87205DDBD14'

export const ERC777PolicyFactoryAddress = '0xa8275A182196C13B1411ab67E96C8f2130a4bC53'

export const ERC1155PolicyFactoryAddress = '0x0D523d66361275aA2Fcc77Fd159Ce25Ad80Ff95f'

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
