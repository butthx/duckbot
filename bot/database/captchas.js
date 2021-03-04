const mongoose = require("mongoose");
const { Schema } = mongoose;
const captchasData = new Schema({
  user_id : {
    type: Number
  },
  chat_id : {
    type : Number
  }
})