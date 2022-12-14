const ERC20PolicyFactoryAddress = '0xe2eC4976E3365FE0f1f92A45bc9a4591d6fD3769'
const ERC721PolicyFactoryAddress = '0x85c8864d208a328ac659Cf05792C3508E22c0C5f'
const ERC777PolicyFactoryAddress = '0xb17DB8167a3B894Df3D808b1dE3F1CAcF19772E5'
const ERC1155PolicyFactoryAddress = '0x3eBE32c8B9eAD3ABaA9a122b2acCaB7706780a62'

const JoinPolicyRegistryAddress = '0x3eB2Ec4d2876d22EE103aBc1e0A7CCEefD117CD3'

enum PermissionType {
    Edit = 0,
    Delete,
    Publish,
    Subscribe,
    Grant,
}

export {
    ERC20PolicyFactoryAddress,
    ERC721PolicyFactoryAddress,
    ERC777PolicyFactoryAddress,
    ERC1155PolicyFactoryAddress,
    JoinPolicyRegistryAddress,
    PermissionType,
}
