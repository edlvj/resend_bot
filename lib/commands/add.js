const { getChats } = require('./../mtproto/methods');
const { Publisher } = require('./../storage');
const Question = require('telegram-api/types/Question');
const Message = require('telegram-api/types/Message');

const bot = require('./../resend_bot');

bot.command('add', message => {
  add(message).then(publisher => {
    let answer = new Message().text('Record added').to(message.from.id);
    bot.send(answer);
  })
});

const add = async(message) => {
  const chats = await getChats();
  let newPublisher = new Publisher();
  let pubChats = pubChatTitles(chats);

  const selectPub = new Question({
    text: 'Select publisher group.',
    answers: pubChats
  });

  const selectedPub = await bot.askKeyboardQuestion(selectPub, message);
  const from_chat = chats.find(chat => chat.title === selectedPub.text);

  newPublisher.from_chat = from_chat.id;
  newPublisher.from_chat_type = from_chat._;

  let subChats = subChatTitles(chats, from_chat);

  const selectSub = new Question({
    text: 'Choose subscriber group',
    answers: subChats
  });

  const selectedSub = await bot.askKeyboardQuestion(selectSub, message);
  const to_chat = chats.find(chat => chat.title === selectedSub.text);

  newPublisher.to_chat = to_chat.id;
  newPublisher.to_chat_type = to_chat._;

  return await newPublisher.save();
}

const chatFilter = function(chats) {
  return chats.filter(function(chat) {
    return chat._ == 'chat' || chat.hasOwnProperty('megagroup');
  });
}

const pubChatTitles = function(chats) {
  return chatFilter(chats).map(chat => {
    return new Array(chat.title);
  });
}

const subChatTitles = function(chats, from_chat) {
  return chatFilter(chats).map(chat => {
    if(chat.id != from_chat.id)  
      return new Array(chat.title);
  }).filter(function(chat) {
    return chat;
  });
}

module.exports = add; 