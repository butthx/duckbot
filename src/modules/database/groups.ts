import mongoose, {
  Schema,
  Document
} from "mongoose"
interface IUser extends Document {
chat_id : number;
lang : string;
rules : string;
blacklist : {
  triger : Array<any>;
  action : string;
};
welcome: {
  status: boolean;
  captcha: {
    status: boolean;
    captchaType: string;
    time: string;
    action : string;
  };
  deleteOldMessage: {
    status: boolean;
    message_id: number;
  };
  wlcType: string;
  value: string;
  caption : string;
};
goodbye: {
  status: boolean;
  deleteOldMessage: {
    status: boolean;
    message_id: number;
  };
  gbType: string;
  value: string;
  caption:string;
};
notes: {
  status : boolean;
  value: Array<any>;
  deleteOldMessage: {
    status: boolean;
    message_id: number;
  }
};
filters: {
  status : boolean;
  value: Array<any>;
  deleteOldMessage: {
    status: boolean;
    message_id: number;
  }
};
admins: Array<any>;
dateAdmin : number;
users: Array<any>;
purgeFrom:number;
duckbotmata: boolean;
das : boolean; 
cleanEvent : {
  status : boolean
  pin : boolean;
  welcome : boolean;
  goodbye : boolean;
  voiceChat : boolean;
}
}
export const groupsSchema = new Schema({
chat_id: {
  type: Number
},
lang: {
  type: String,
  default : 'en'
},
rules: {
  type: String,
  default : ''
},
blacklist: {
  triger: {
    type: Array,
    default : new Array()
  },
  action: {
    type: String,
    default : 'ban'
  }
},
welcome: {
  status: {
    type: Boolean,
    default: true
  },
  captcha: {
    status: {
      type: Boolean,
      default: false
    },
    captchaType: {
      type: String,
      default: "number"
    },
    time: {
      type: String,
      default: "5m"
    },
    action : {
      type : String,
      default: "kick"
    }
  },
  deleteOldMessage: {
    status: {
      type: Boolean,
      default: false
    },
    message_id: {
      type: Number,
      default: 0
    }
  },
  wlcType: {
    type: String,
    default: "text"
  },
  value: {
    type: String,
    default: "Hi,Welcome!"
  },
  caption : {
    type : String
  }
},
goodbye: {
  status: {
    type: Boolean,
    default: true
  },
  deleteOldMessage: {
    status: {
      type: Boolean,
      default: false
    },
    message_id: {
      type: Number,
      default: 0
    }
  },
  gbType: {
    type: String,
    default: "text"
  },
  value: {
    type: String,
    default: "Have A Nice Day!"
  },
  caption : {
    type : String
  }
},
notes: {
  status: {
    type: Boolean,
    default: true
  },
  value: {
    type: Array,
    default: new Array()
  },
  deleteOldMessage: {
    status: {
      type: Boolean,
      default: false
    },
    message_id: {
      type: Number,
      default: 0
    }
  }
},
filters: {
  status: {
    type: Boolean,
    default: true
  },
  value: {
    type: Array,
    default: new Array()
  },
  deleteOldMessage: {
    status: {
      type: Boolean,
      default: false
    },
    message_id: {
      type: Number,
      default: 0
    }
  }
},
admins: {
  type: Array,
  default: new Array()
},
dateAdmin : {
  type : Number,
  default : Date.now()
},
users: {
  type: Array,
  default: new Array()
},
purgeFrom : {
  type : Number,
  default : 0
},
duckbotmata: {
  type: Boolean,
  default: true
},
das : {
  type : Boolean,
  default : true
},
cleanEvent : {
  status: {
    type: Boolean,
    default: true
  },
  pin : {
    type: Boolean,
    default: true
  },
  welcome : {
    type: Boolean,
    default: true
  },
  goodbye : {
    type: Boolean,
    default: true
  },
  voiceChat : {
    type: Boolean,
    default: true
  }
}
})
groupsSchema.set("strict",false)
groupsSchema.set("iAmNotInTheSchema",false)
groupsSchema.set("timestamps",true)
const groups = mongoose.model < IUser > ("groups", groupsSchema)
export default groups