const { getChats } = require('./../mtproto/methods');
const bot = require('./../resend_bot');
const Message = require('telegram-api/types/Message');

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

  let chatTitles = chats.filter(function(chat) {
    return chat._ == 'chat' || chat.hasOwnProperty('megagroup');
  }).map(chat => {
    return chat.title;
  })

  return chatTitles;
}

module.exports = chats;