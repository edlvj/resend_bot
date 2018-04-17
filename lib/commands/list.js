const { getChats } = require('./mtproto/methods');
const { Publisher } = require('./storage/index');

var list = async() => {
  let chats = await getChats();
  let publishers = await Publisher.find({}).exec();
  
  if(publishers.length == 0) 
    return [];

  var publishersList = publishers.map(publisher => {
    let from_chat = chats.find(chat => chat.id === parseInt(publisher.from_chat));
    let to_chat = chats.find(chat => chat.id === parseInt(publisher.to_chat));

    return from_chat.title + ' => ' + to_chat.title;
  });

  return publishersList;
}

module.exports = {
  list
};