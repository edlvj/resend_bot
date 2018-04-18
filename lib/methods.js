const { getFullChat, addChatUser, getParticipants, inviteToChannel } = require('./mtproto/methods');
const { isMegaGroup, isGroup } = require('./utils');
const { inviteLog } = require('./storage/index');

var getInfoFromGroup = function (chat, options) {
  if(isGroup(chat)) {
    return getFullChat(chat.id);
  } 

  if (isMegaGroup(chat)) {
    let inputChannel = {
      _: 'inputChannel',
      channel_id: chat.id,
      access_hash: chat.access_hash
    };
    return getParticipants(inputChannel, options);
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

var userFilter = function(users) {
  var users = users.filter(function(user) {
    return !user.hasOwnProperty('bot') && !user.hasOwnProperty('self');
  });

  return users;
}

var maxInvited = function(inviteLog, chat) {
  if(isGroup(chat)) {
    return inviteLog.invited_count > chat.users.length; 
  }

  if(isMegaGroup(chat)) {
    return inviteLog.invited_count > chat.count;
  }
  return false;  
}

var inviteUsers = async(from, to, limit = 50) => {
  var inviteLogProperties = {
    from_chat_id: from.id,
    to_chat_id: to.id
  };

  const iLog = await inviteLog.findOne(inviteLogProperties);

  var offset = iLog ? iLog.invited_count : 0;

  var chat = await getInfoFromGroup(from, { limit: limit, offset: offset });
  
  if(iLog && maxInvited(iLog, chat))
    return Promise.reject(new Error('You reached max invites'));

  var users = userFilter(chat.users);

  var inviteCount = users.length < limit ? users.length : limit;
  var i = 0;

  while (i < inviteCount) {
    try {
      await inviteUserToGroup(to, users[i]);
    } catch(e) {
      console.log(e.message)
    }
    await inviteLog.updateOne(inviteLogProperties, { $inc: {"invited_count": 1 } }, {upsert: true, new: true});
    i++;
  }

  return i;
}

module.exports = {
  inviteUsers,
  getInfoFromGroup,
  inviteUserToGroup
};