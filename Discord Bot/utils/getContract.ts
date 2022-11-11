import {ethers} from "ethers"
import {FaucetAbi,GOERLI_FAUCET_ADDRESS,CELO_FAUCET_ADDRESS,CeloFaucetAbi,MUMBAI_POLYGON_FAUCET_ADDRESS} from "../ContractsData/data";
import dotenv from "dotenv";
import {Chains} from "../enums/chainsEnum"
dotenv.config()

export const getContract = async(chain:Chains)=>{
    let RpcURL,contractAddress,contractAbi;

    switch(chain){
        case Chains.goerli : 
            RpcURL = process.env.GOERLI_RPC_URL;
            contractAddress = GOERLI_FAUCET_ADDRESS;
            contractAbi = FaucetAbi;
            break;

        case  Chains.matic : 
            RpcURL = process.env.QUICKNODE_MUMBAI_POLYGON_RPC_URL;
            contractAddress = MUMBAI_POLYGON_FAUCET_ADDRESS;
            contractAbi = FaucetAbi;
            break;

        case Chains.celoAlfajores: 
            RpcURL = process.env.CELO_RPC_URL;
            contractAddress = CELO_FAUCET_ADDRESS;
            contractAbi = CeloFaucetAbi;
            break;
    }

    //provider
    const provider = new ethers.providers.JsonRpcProvider(RpcURL)
    
    //contract
    const contract = new ethers.Contract(contractAddress,contractAbi,provider);

    //wallet
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string,provider);
    const contractWithWallet = contract.connect(wallet);

    return contractWithWallet;
}
