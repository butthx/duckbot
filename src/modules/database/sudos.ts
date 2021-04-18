import mongoose,{Schema,Document} from "mongoose"
interface IUser extends Document {
  user : string;
  value : Array<any>
}
export const sudoSchema = new Schema({
  user : {
    type : String,
    default : "sudo"
  },
  value : {
    type : Array,
    default : [1241805547]
  }
})
const sudos = mongoose.model<IUser>("sudos",sudoSchema)
export default sudos