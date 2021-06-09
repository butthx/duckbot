import {client, bot} from '../';
import {Api} from 'telegram';
import {NewMessage} from 'telegram/events';
import {Message} from 'telegram/tl/custom/message';
import {NewMessageEvent} from 'telegram/events/NewMessage';
import {gramGetPing, gramGetLang, gramIsAdmin, gramReportError} from './misc';

export async function purge(event: NewMessageEvent) {
  const message = event.message as Message;
  const c = await gramGetPing(event);
  const langs = await gramGetLang(event);
  try {
    let rplMsgId: any = message.replyTo?.replyToMsgId;
    const msgId: any = message.id;
    const abs: any = Math.abs(msgId - rplMsgId);
    const arr: any = new Array();
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
          const res = await bot.telegram.deleteMessage(Number(event.chatId), arr[i]);
        } catch (error) {}
      }
    } else {
      const admin = await gramIsAdmin(event);
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
        const res: Api.messages.AffectedMessages = await client.invoke(
            new Api.channels.DeleteMessages({
              channel: message.inputChat,
              id: arr,
            }),
        );
      } catch (e) {}
    }
    const msgSend = await bot.telegram.sendMessage(
        Number(event.chatId),
        `${langs.purgeSuccess}\n⏱ <code>${c}</code> | ⏳ <code>${await gramGetPing(event)}</code>`,
        {
          parse_mode: 'HTML',
        },
    );
    setTimeout(() => {
      return bot.telegram.deleteMessage(msgSend.chat.id, msgSend.message_id);
    }, 3000);
  } catch (error) {
    return gramReportError(error, event);
  }
}
