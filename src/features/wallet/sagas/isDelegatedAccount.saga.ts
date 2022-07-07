import { WalletAction } from "$/features/wallet";
import { Contract } from "ethers";
import { useDispatch } from "react-redux";
import { takeEvery } from "redux-saga/effects";
import * as DelegatedAccessRegistry from '../../../contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'

const DelegatedAccessRegistryAddress = '0xf5803cdA6352c515Ee11256EAA547BE8422cC4EE'

function* onIsDelegatedAccount({
    payload: { metamaskAccount, delegatedAccount }
}:
    ReturnType<typeof WalletAction.isDelegatedAccount>) {
    const dispatch = useDispatch()

    const contract = new Contract(DelegatedAccessRegistryAddress, DelegatedAccessRegistry.abi)

    const isAuthorized: boolean = yield contract.functions.isUserAuthorized(
        metamaskAccount,
        delegatedAccount
    )

    console.warn('isAuthorized', isAuthorized, metamaskAccount, delegatedAccount)
    dispatch(
        WalletAction.setDelegatedPair({
            metamaskAccount,
            delegatedAccount
        })
    )
}

export default function* isDelegatedAccount() {
    yield takeEvery(WalletAction.isDelegatedAccount, onIsDelegatedAccount);
}