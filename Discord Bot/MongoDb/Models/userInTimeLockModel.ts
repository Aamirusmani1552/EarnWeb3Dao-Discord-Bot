import { model , Schema} from "mongoose";
import { IUserInTimeLock } from "../../Interfaces/IUserInTimeLock";

const userTimeLockSchema = new Schema(
    {
        discordId:String,
        timeLockPeriod: Number,
        chain: String,
        token: String,
        address: String
    }
)

export const timeLockModel =  model<IUserInTimeLock>('timeLocks',userTimeLockSchema)
