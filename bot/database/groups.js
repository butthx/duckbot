const mongoose = require("mongoose");
const { Schema } = mongoose;
const groupsData = new Schema({
  chat_id: {
    type: Number
  },
  language: {
    type: String
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
    }
  },
  notes: {
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
  users: {
    type: Array,
    default: new Array()
  },
  settings: {
    sangmata: {
      type: Boolean,
      default: true
    },
    cas: {
      type: Boolean,
      default: true
    },
    spamWatch: {
      type: Boolean,
      default: true
    }
  }
});
module.exports = mongoose.model("groups", groupsData, "chat");
