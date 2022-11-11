import { Document } from "mongoose";

export interface IAddressModel extends Document{
    faucetAddress: string;
    tokenAddress: string;
    blockChain: string;
}