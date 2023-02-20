const ERC20PolicyFactoryAddress = '0x74A40cA38616FD84F9ee5576e28a42aDA7302607'
const ERC721PolicyFactoryAddress = '0xE663C2A9C7305FA367099393fcd653ABF9a4336e'
const ERC777PolicyFactoryAddress = '0x75052450c36C084f9D29501e630d8Ca1dbF0464D'
const ERC1155PolicyFactoryAddress = '0x0f31377cBd078C82b34Ab586A3f8d973fEea9385'

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
