const { getFullChat, addChatUser, getParticipants, inviteToChannel } = require('./../mtproto/methods');
const { isMegaGroup, isGroup } = require('./utils');
const { inviteLog } = require('./../storage/index');

var getInfoFromGroup = function (chat, limit = 10) {
  if(isGroup(chat)) {
    return getFullChat(chat.id);
  } 

  if (isMegaGroup(chat)) {
    let inputChannel = {
      _: 'inputChannel',
      channel_id: chat.id,
      access_hash: chat.access_hash
    };
    return getParticipants(inputChannel, limit);
  }
  return Promise.reject(new Error('Wrong chat type'));
};

var inviteUserToGroup = function(chat, user) {
  var inputUser = {
    _: 'inputUser',
    user_id: user.id,
    access_hash: user.access_hash
  };

  if(isGroup(chat)) {
    return addChatUser(chat.id, inputUser);
  } 
  
  if (isMegaGroup(chat)) {
    let inputChannel = {
       _: 'inputChannel',
      channel_id: chat.id,
      access_hash: chat.access_hash
    };
    return inviteToChannel(inputChannel, [inputUser]);
  }
  return Promise.reject(new Error('Wrong chat type'));
}

var startFrom = async(properties, usersCount) => {
  var inviteLogCount = await inviteLog.count(properties);
  var startFrom = inviteLogCount - usersCount;

  var res = startFrom > 0 ? startFrom : 0;
  return res;
}

var userFilter = function(start, users) {
  var users = users.slice(start, users.length);

  users = users.filter(function(user) {
    return !user.hasOwnProperty('bot') && !user.hasOwnProperty('self');
  });

  return users;
}

var inviteUsers = async(from, to, limit = 10) => {
  var inviteLogProperties = {
    from_chat_id: from.id,
    to_chat_id: to.id
  };

  var chat = await getInfoFromGroup(from, limit);
  const start = await startFrom(inviteLogProperties, chat.users.length);

  var users = userFilter(start, chat.users);
  var inviteCount = users.length < limit ? users.length : limit;

  var i = 0;

  while (i < inviteCount) {
    var iLog = await inviteLog.findOne(inviteLogProperties).exec();

    if(!iLog) {
      try {
        await inviteUserToGroup(to, users[i]);
      } catch(e) {
        console.log(e.message)
      }

      inviteLogProperties.user_id = users[i].id;
      new inviteLog(inviteLogProperties).save();
    }      
    i++;
  }
  return inviteCount;
}

module.exports = {
  inviteUsers,
  getInfoFromGroup,
  inviteUserToGroup
};