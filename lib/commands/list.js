const { getChats } = require('./../mtproto/methods');
const { Publisher } = require('./../storage/index');
const Message = require('telegram-api/types/Message');
const bot = require('./../resend_bot');

bot.command('list', function(message) {
  list().then(publishers => {
    if(publishers.length == 0) {
      answer = new Message().text('No publishers').to(message.from.id);
    } else {
      answer = new Message().text(publishers.join('\n')).to(message.from.id);
    }
    bot.send(answer);
  });
});

const list = async() => {
  let chats = await getChats();
  let publishers = await Publisher.find({}).exec();

  if(publishers.length == 0) 
    return publishers;

  return listMap(chats, publishers);
}

const listMap = function(chats, publishers) {
  const res = publishers.map(publisher => {
    let from_chat = chats.find(chat => chat.id === parseInt(publisher.from_chat));
    let to_chat = chats.find(chat => chat.id === parseInt(publisher.to_chat));

    return from_chat.title + ' => ' + to_chat.title;
  });

  return res;
}

module.exports = list;