const { getChats } = require('./../mtproto/methods');
const { Publisher } = require('./../storage/index');

var list = async() => {
 // var newPublisher = new Publisher();
  var chats = await getChats();

  var chats = chats.filter(function(chat) {
    return chat.hasOwnProperty('creator');
  });

  var publishers = await Publisher.find({});
}

module.exports = {
  list
};