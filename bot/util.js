require("dotenv").config();
const yaml = require("js-yaml");
const mongoose = require('mongoose')
const fs = require("fs");
const { lang } = require("./lang/language");
const usersData = require('./database/users')
const groupsData = require('./database/groups')
const util = {
  makeid: function(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  sleep: function(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  },
  kirimpesan: async function(ctx, text = "", keyboard = "") {
    try {
      if (ctx.message.reply_to_message) {
        if (keyboard !== "") {
          return await ctx.reply(text, {
            parse_mode: "HTML",
            reply_to_message_id: ctx.message.reply_to_message.message_id,
            reply_markup: {
              inline_keyboard: keyboard
            },
            disable_web_page_preview: true
          });
        } else {
          return await ctx.reply(text, {
            parse_mode: "HTML",
            reply_to_message_id: ctx.message.reply_to_message.message_id,
            disable_web_page_preview: true
          });
        }
      } else if (keyboard !== "") {
        return await ctx.reply(text, {
          parse_mode: "HTML",
          reply_to_message_id: ctx.message.message_id,
          reply_markup: {
            inline_keyboard: keyboard
          },
          disable_web_page_preview: true
        });
      } else {
        return await ctx.reply(text, {
          parse_mode: "HTML",
          reply_to_message_id: ctx.message.message_id,
          disable_web_page_preview: true
        });
      }
    } catch (error) {
      this.error_log(ctx, error);
    }
  },
  error_log: async function(ctx, err) {
    try {
      ctx.reply(
        "ops! something wrong! I send the error log to developer.Maybe Developer can fix this error!"
      );
      ctx.telegram.sendMessage(
        process.env.ERROR_LOG,
        `Hi Dev! i'am error! i will send document to report this error! if i not send please check the console!`
      );
      console.log(err);
      console.log(ctx.message);
      let error_file_name = `Error-${Date.now()}.txt`;
      let error_data = `Error Date : ${new Date(
        Date.now()
      ).toUTCString()}\nMessage info :\n${JSON.stringify(
        ctx.message
      )}\nError Info :\n${JSON.stringify(err)}\n${err}`;
      fs.writeFileSync(`./${error_file_name}`, error_data);
      this.sleep(1000);
      let msg = await ctx.telegram.sendDocument(
        process.env.ERROR_LOG,
        { source: `./${error_file_name}`, filename: error_file_name },
        {
          caption: `${error_file_name}\n From : ${ctx.message.chat.id}\n${err.message}`
        }
      );
      ctx.telegram.pinChatMessage(msg.chat.id, msg.message_id, {
        disable_notification: false
      });
      this.sleep(1000);
      return fs.unlinkSync(`./${error_file_name}`);
    } catch (error) {
      let emsg = await ctx.telegram.sendMessage(
        process.env.ERROR_LOG,
        `Hi Dev! I can't send document! please check log!`
      );
      return ctx.telegram.pinChatMessage(emsg.chat.id, emsg.message_id, {
        disable_notification: false
      });
    }
  },
  kirimPesanPin: async function(ctx, text = "", keyboard = "") {
    try {
      if (keyboard !== "") {
        return await ctx.reply(text, {
          parse_mode: "HTML",
          reply_to_message_id: ctx.message.message_id,
          reply_markup: {
            inline_keyboard: keyboard
          },
          disable_web_page_preview: true
        });
      } else {
        return await ctx.reply(text, {
          parse_mode: "HTML",
          reply_to_message_id: ctx.message.message_id,
          disable_web_page_preview: true
        });
      }
    } catch (error) {
      this.error_log(ctx, error);
    }
  },
  getLang: async function(lang, params) {
    try {
      let lang = yaml.load(fs.readFileSync(`./lang/${lang}.yml`, "utf8"));
      let r = JSON.parse(lang);
      return r[params];
    } catch (error) {
      return "Error can't get language!";
    }
    //  let language = 'en'
    //  if(ctx.callbackQuery){
    //    if (ctx.callbackQuery.from.language_code && lang[ctx.callbackQuery.from.language_code]) {
    //     language = ctx.callbackQuery.from.language_code.toLowerCase()
    // }
    //  }else{
    //  if (ctx.message.from.language_code && lang[ctx.message.from.language_code]) {
    //     language = ctx.message.from.language_code.toLowerCase()
    //    }
    // }
    // return lang[language][params]
  },
  saveUser : async function(ctx){
    try{
      if(ctx.message.chat.type == 'private'){
        let data = await usersData.usersData.findOne({chat_id:ctx.message.chat.id})
        if(data == null){
         let user = new usersData()
          user.chat_id = ctx.message.chat.id
          user.first_name = ctx.message.chat.first_name
          user.last_name = ctx.message.chat.last_name
          user.username = ctx.message.chat.username
          user.warns = []
          user.language = 'en'
          user.notes.value = []
          user.notes.deleteOldMessage.status = false
          user.notes.deleteOldMessage.message_id = 0
          user.filters.value = []
          user.filters.deleteOldMessage.status = false
          user.filters.deleteOldMessage.message_id = 0
          await user.save()
        }
          return;
      }else{
        let data = await usersData.usersData.findOne({chat_id:ctx.message.chat.id})
        if(data == null){
         let user = new usersData()
        }
       return;
      }
    }catch(error){
      return error
    }
  }
};
module.exports = util;
