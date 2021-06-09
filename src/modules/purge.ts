import {client, bot} from '../';
import {Api} from 'telegram';
import {NewMessage} from 'telegram/events';
import {Message} from 'telegram/tl/custom/message';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {gramGetPing, gramGetLang, gramIsAdmin, gramReportError} from './misc';

export async function purge(event: NewMessageEvent) {
  let message = event.message as Message;
  let c = await gramGetPing(event);
  let langs = await gramGetLang(event);
  try {
    let rplMsgId: any = message.replyTo?.replyToMsgId;
    let msgId: any = message.id;
    let abs: any = Math.abs(msgId - rplMsgId);
    let arr: any = new Array();
    if (!message.replyTo) {
      return bot.telegram.sendMessage(
          Number(event.chatId),
          `${langs.mustReply}\n⏱ <code>${c}</code> | ⏳ <code>${await gramGetPing(event)}</code>`,
          {
            parse_mode: 'HTML',
            reply_to_message_id: msgId,
          },
      );
    }
    for (let i = 0; i < abs; i++) {
      arr.push(rplMsgId++);
    }
    arr.push(msgId);
    if (event.isPrivate) {
      for (let i = 0; i < arr.length; i++) {
        try {
          let res = await bot.telegram.deleteMessage(Number(event.chatId), arr[i]);
        } catch (error) {}
      }
    } else {
      let admin = await gramIsAdmin(event);
      if (!admin) {
        return bot.telegram.sendMessage(
            Number(event.chatId),
            `${langs.userNonAdmin}\n⏱ <code>${c}</code> | ⏳ <code>${await gramGetPing(
                event,
            )}</code>`,
            {
              parse_mode: 'HTML',
              reply_to_message_id: msgId,
            },
        );
      }
      try {
        let res: Api.messages.AffectedMessages = await client.invoke(
            new Api.channels.DeleteMessages({
              channel: message.inputChat,
              id: arr,
            }),
        );
      } catch (e) {}
    }
    let msgSend = await bot.telegram.sendMessage(
        Number(event.chatId),
        `${langs.purgeSuccess}\n⏱ <code>${c}</code> | ⏳ <code>${await gramGetPing(event)}</code>`,
        {
          parse_mode: 'HTML',
        },
    );
    setTimeout(() => {
      try {
        return bot.telegram.deleteMessage(msgSend.chat.id, msgSend.message_id);
      } catch (error) {
        return gramReportError(error, event);
      }
    }, 3000);
  } catch (error) {
    return gramReportError(error, event);
  }
}
