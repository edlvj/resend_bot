var isMegaGroup = function(chat) {
  if(chat._ == 'channel' && chat.hasOwnProperty('megagroup')) {
    return true;
  }
  return false
}

var isGroup = function(chat) {
  if(chat._ == 'chat' && !chat.hasOwnProperty('migrated_to')) {
    return true;
  }
  return false;
}

var isChannel = function(chat) {
  if(chat._ == 'channel' && !chat.hasOwnProperty('megagroup')) {
    return true;
  }
  return false;
}

var getChatId = function(chat_type, chat_id) {
  if(chat_type == "chat"){
    return -Math.abs(chat_id);
  } else if(chat_type == "channel") {
    return parseInt('-100' + chat_id);   
  }
};

module.exports = {
  isMegaGroup,
  isGroup,
  isChannel,
  getChatId
};