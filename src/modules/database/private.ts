import mongoose, {
  Schema,
  Document
} from "mongoose"

interface IUser extends Document {
  chat_id: number;
  lang: string;
  more: any;
}
let defaultObject = {
  value: 0,
  warns: [],
  connected: 0
}
export const privateSchema = new Schema({
  chat_id: {
    type: Number
  },
  lang: {
    type: String,
    default: 'en'
    },
    more: {
      type: Object,
      default: defaultObject
      }
    })
  const privates = mongoose.model < IUser > ("privates", privateSchema)
  export default privates