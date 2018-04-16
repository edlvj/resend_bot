const { getChats } = require('./../mtproto/methods');

var add = async() => {
  var newPublisher = new Publisher();
  var chats = await getChats();

  var chats = chats.filter(function(chat) {
    return chat._ == 'chat' || chat.hasOwnProperty('megagroup');
  });

  var chatTitles = chats.map(chat => {
    return chat.title;
  }).join('\n');

  return chatTitles;
}

module.exports = add;