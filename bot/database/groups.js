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
    type: String
  },
  blacklist: {
    triger: {
      type: Array
    },
    action: {
      type: String
    }
  },
  welcome: {
    status: {
      type: Boolean
    },
    captcha: {
      status: {
        type: Boolean
      },
      captchaType: {
        type: String
      },
      time: {
        type: String
      }
    },
    deleteOldMessage: {
      status: {
        type: Boolean
      },
      message_id: {
        type: Number
      }
    },
    wlcType: {
      type: String
    },
    value: {
      type: String
    }
  },
  goodbye: {
    status: {
      type: Boolean
    },
    deleteOldMessage: {
      status: {
        type: Boolean
      },
      message_id: {
        type: Number
      }
    },
    gbType: {
      type: String
    },
    value: {
      type: String
    }
  },
  notes: {
    value: {
      type: Array
    },
    deleteOldMessage: {
      status: {
        type: Boolean
      },
      message_id: {
        type: Number
      }
    }
  },
  filters: {
    value: {
      type: Array
    },
    deleteOldMessage: {
      status: {
        type: Boolean
      },
      message_id: {
        type: Number
      }
    }
  },
  admins: {
    type: Array
  },
  users: {
    type: Array
  },
  settings: {
    sangmata: {
      type: Boolean
    },
    cas: {
      type: Boolean
    },
    spamWatch: {
      type: Boolean
    }
  }
});
module.exports = mongoose.model('groups',groupsData,'chat')
