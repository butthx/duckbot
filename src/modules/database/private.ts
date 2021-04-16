import mongoose,{Schema,Document} from "mongoose"

interface IUser extends Document { 
  chat_id : number;
  value : number;
  warns : Array<any>;
  lang : string;
  notes: {
    value: Array<any>;
    deleteOldMessage: {
      status: boolean;
      message_id: number;
    };
  };
  filters: {
    value: Array<any>;
    deleteOldMessage: {
      status: boolean;
      message_id: number;
    };
  };
}
export const privateSchema = new Schema({
  chat_id: {
    type: Number
  },
  value:{
    type:Number,
    default : 0
  },
  warns: {
    type: Array,
    default : new Array()
  },
  lang: {
    type: String,
    default : 'en'
  },
  notes: {
    value: {
      type: Array,
      default : new Array()
    },
    deleteOldMessage: {
      status: {
        type: Boolean,
        default : false
      },
      message_id: {
        type: Number,
        default : 0
      }
    }
  },
  filters: {
    value: {
      type: Array,
      default : new Array()
    },
    deleteOldMessage: {
      status: {
        type: Boolean,
        default : false
      },
      message_id: {
        type: Number,
        default : 0
      }
    }
  }
})
const privates = mongoose.model<IUser>("privates",privateSchema)
export default privates