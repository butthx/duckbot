const mongoose = require ('mongoose')
const { Schema } = mongoose;
const groupsData = new Schema({
  chat_id : {
    type : Number
  },
  language: {
   type : String
  },
  rules : {
    type : String
  },
  blacklist : {
    triger : {
      type : Array
    },
    action : {
      type : String
   }
  },
 welcome : {
   status : {
     type : Boolean
   },
   captcha : {
     status : {
       type : Boolean
     },
     captchaType : {
       type : String
     },
     time : {
       type : String
     }
   },
   deleteOldMessage : {
    status : {
      type : Boolean
    },
    message_id : {
      type : 
    }
  }
 }
})