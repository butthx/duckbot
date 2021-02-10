const util = require('./util')
const { lang } = require('./lang/language')
const report_module = require('./admin')
//DuckBot QueQue
let task = []
let taskTotal = 0
function addTask(ctx,chatId,msgId){
  let data = {
    chatId : chatId,
    msgId : msgId
  }
  task.push(data)
  if(taskTotal == 0){
    return runTask(ctx)
  }
}
function taskDone(ctx){
  task.shift()
  if(task.length == 0){
    return taskTotal = 0
  }else{
    util.sleep(200)
    runTask(ctx)
  }
}
async function runTask(ctx){
 try {
   taskTotal++
   //running task
   let chatId = task[0].chatId
   let msgId = task[0].msgId
   await ctx.telegram.deleteMessage(chatId,msgId)
   /*console.log(chatId)
   console.log(msgId)
   console.log(task)*/
    //if done
   taskDone(ctx)
 } catch (e) {
   taskDone(ctx)
 }
}
//modules
const delete_module = {
  deleteMessage : async function(ctx){
    try {
      if(ctx.message.chat.type == 'private'){
          if(ctx.message.reply_to_message){
          ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.reply_to_message.message_id)
          return ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id)
        }else{
          return ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id)
        }
      }else{
        let admin = await report_module.adminCheck(ctx,ctx.message.from.id)
        if(admin){
              if(ctx.message.reply_to_message){
          ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.reply_to_message.message_id)
          return ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id)
        }else{
          return ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id)
        }
        }
      }
    } catch (e) {
      return util.error_log(ctx,e)
    }
  },
 deleteFrom : async function(ctx){
   try {
     if(ctx.message.chat.type == 'private'){
      if(ctx.message.reply_to_message){
        let dif =  Number(Math.abs(Number(ctx.message.reply_to_message.message_id) - Number(ctx.message.message_id)))
        ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id)
        for(let i = 0; i < dif; i++){
          let msgid = Number(ctx.message.reply_to_message.message_id+i)
          addTask(ctx,ctx.message.chat.id,msgid)
        }
      }else{
        return this.deleteMessage(ctx)
      }
     }else{
       let admin = await report_module.adminCheck(ctx,ctx.message.from.id)
       if(admin){
         if(ctx.message.reply_to_message){
        let dif =  Number(Math.abs(Number(ctx.message.reply_to_message.message_id) - Number(ctx.message.message_id)))
        ctx.telegram.deleteMessage(ctx.message.chat.id,ctx.message.message_id)
        for(let i = 0; i < dif; i++){
          let msgid = Number(ctx.message.reply_to_message.message_id+i)
          addTask(ctx,ctx.message.chat.id,msgid)
          }
      }else{
        return this.deleteMessage(ctx)
      }
       }
     }
    } catch (e) {
      return ;
    }
 }
}

module.exports = delete_module