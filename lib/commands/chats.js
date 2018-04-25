const { getChats } = require('./../mtproto/methods');
const { chatFilter } = require('./../methods');

const Message = require('telegram-api/types/Message');
const bot = require('./../resend_bot');

bot.command('chats', message => {
  chats().then(chatList => {
    if(chatList.length == 0) {
      answer = new Message().text('No group chats').to(message.from.id);
    } else {
      answer = new Message().text(chatList.join('\n')).to(message.from.id);
    }
    bot.send(answer);
  });
});

const chats = async() => {
  let chats = await getChats();

  let chatTitles = chatFilter(chats).map(chat => {
    return chat.title;
  });

  return chatTitles;
}

module.exports = chats;