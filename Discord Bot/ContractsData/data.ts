import {CELO_FAUCET_ADDRESS,GOERLI_FAUCET_ADDRESS,MUMBAI_POLYGON_FAUCET_ADDRESS} from "./address"
import Faucet from "./FaucetAbi.json";
import CeloFaucet from "./CeloFaucetAbi.json";
const FaucetAbi = Faucet.abi;
const CeloFaucetAbi = CeloFaucet.abi;

export {
    CELO_FAUCET_ADDRESS,
    GOERLI_FAUCET_ADDRESS,
    MUMBAI_POLYGON_FAUCET_ADDRESS,
    FaucetAbi,
    CeloFaucetAbi
}