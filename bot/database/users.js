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
    type: Array
  },
  language: {
    type: String
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
  }
});

module.exports = mongoose.model("users", usersData, "chat");
