const { getChats, inviteUsers } = require('./../mtproto/methods');
const Question = require('telegram-api/types/Question');
const Message = require('telegram-api/types/Message');

const { chatFilter } = require('./../methods');
const bot = require('./../resend_bot');

bot.command('invite', function(message) {
  invite(message).then(invite_count => {
    let answer = new Message().to(message.chat.id).text(count + ' invitations have been sent');
    //check log
    bot.send(answer);
  })
});

const invite = async(message) => {
  const chats = await getChats();
  const filteredChats = chatFilter(chats); 

  const selectFromInvite = new Question({
    text: 'Choose from invite group',
    answers: fromChatTitles(filteredChats)
  });

  const selectedFromInvite = await bot.askKeyboardQuestion(selectFromInvite, message);
  const fromGroup = filteredChats.find(chat => chat.title === selectedFromInvite.text);

  const selectToInvite = new Question({
    text: 'Choose to invite group',
    answers: toChatTitles(filteredChats, fromGroup)
  });

  const selectedToInvite = await bot.askKeyboardQuestion(selectToInvite, message);
  const toGroup = chats.find(chat => chat.title === selectedToInvite.text);
  
  return inviteUsers(fromGroup, toGroup);
}

const fromChatTitles = function(chats) {
  return chats.map(chat => {
    return new Array(chat.title);
  });
}

const toChatTitles = function(chats, from_chat) {
  return chats.map(chat => {
    if(chat.id != from_chat.id)  
      return new Array(chat.title);
    }).filter(function(chat) {
      return chat;
  });
}

module.exports = invite;