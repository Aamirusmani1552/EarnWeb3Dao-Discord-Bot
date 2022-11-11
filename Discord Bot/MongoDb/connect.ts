import {connect} from "mongoose";
import dotenv from "dotenv"
dotenv.config()

export const connectDb = async(url:string)=>{
    await connect(url);
    console.log("connected to database!");
}