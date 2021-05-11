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
  rules: "",
  blacklist: {
    triger: [],
    action: "ban"
  },
  welcome: {
    status: true,
    captcha: {
      status: false,
      captchaType: "number",
      time: "5m",
      action: "kick"
    },
    deleteOldMessage: {
      status: true,
      message_id: 1
    },
    wlcType: "text",
    value: "Hi, Welcome!",
    caption: ""
  },
  goodbye: {
    status: true,
    deleteOldMessage: {
      status: true,
      message_id: 1
    },
    gbType: "text",
    value: "Hi, Have A Nice Day!",
    caption: ""
  },
  notes: {
    status: true,
    value: [],
    deleteOldMessage: {
      status: true,
      message_id: 1
    }
  },
  filters: {
    status: true,
    value: [],
    deleteOldMessage: {
      status: true,
      message_id: 1
    }
  },
  admins: [],
  dateAdmin: Number(Date.now()),
  users: [],
  purgeFrom: 0,
  duckbotmata: true,
  das: true,
  cleanEvent: {
    status: true,
    pin: true,
    welcome: true,
    goodbye: true,
    voiceChat: true
  }
}

export const groupsSchema = new Schema({
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
  const groups = mongoose.model < IUser > ("groups", groupsSchema)
  export default groups