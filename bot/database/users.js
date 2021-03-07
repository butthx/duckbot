const mongoose = require("mongoose");
const { Schema } = mongoose;
const usersData = new Schema({
  chat_id: {
    type: Number
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  username: {
    type: String
  },
  warns: {
    type: Array,
    default : new Array()
  },
  language: {
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
});

module.exports = mongoose.model("users", usersData, "chat");
