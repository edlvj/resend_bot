const { getFullChat, addChatUser, getParticipants, inviteToChannel } = require('./mtproto/methods');
const { isMegaGroup, isGroup } = require('./utils');
const { inviteLog } = require('./storage/index');

const getInfoFromGroup = function (chat, options) {
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

const userFilter = function(users) {
  var users = users.filter(function(user) {
    return !user.hasOwnProperty('bot') && !user.hasOwnProperty('self');
  });

  return users;
}

const maxInvited = function(inviteLog, chat) {
  if(!inviteLog.invited_count)
    return false; 

  if(isGroup(chat)) {
    return inviteLog.invited_count > chat.users.length; 
  }

  if(isMegaGroup(chat)) {
    return inviteLog.invited_count > chat.count;
  }
  
  return false;
}

const inviteUserToGroup = function(chat, user) {
  let inputUser = {
    _: 'inputUser',
    user_id: user.id,
    access_hash: user.access_hash
  };

  return addChatUser(chat.id, inputUser);
}

const inviteUsersToMegaGroup = function(chat, inputUsers) {
  let inputChannel = {
    _: 'inputChannel',
    channel_id: chat.id,
    access_hash: chat.access_hash
  };
  return inviteToChannel(inputChannel, inputUsers);
}

Array.prototype.each_slice = function (size, callback){
  for (var i = 0, l = this.length; i < l; i += size){
    callback.call(this, this.slice(i, i + size));
  }
};

const inviteUsers = async(from, to, limit = 300) => {
  let inviteLogProperties = {
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
  
  if(isGroup(to)) {
    while (i < inviteCount) {
      try {
        await inviteUsersToGroup(to, user);
      } catch(e) {
        console.log(e.message)
      }
      await inviteLog.updateOne(inviteLogProperties, { $inc: {"invited_count": 1 } }, {upsert: true, new: true});
      i++;
    }
  }

  console.log(inviteCount);

  if(isMegaGroup(to)) {
    let inputUsers = [];

    while(i < inviteCount) {
      let inputUser = {
        _: 'inputUser',
        user_id: users[i].id,
        access_hash: users[i].access_hash
      };

      inputUsers.push(inputUser);
      i++;
    }
    
    try {
      inputUsers.each_slice(10, function (slice){
        inviteUsersToMegaGroup(to, slice);
      });
      await inviteLog.updateOne(inviteLogProperties, { $inc: {"invited_count": inputUsers.length } }, {upsert: true, new: true});
    } catch(e) {
      console.log(e.message)
    }
  }  
  return i;
}

module.exports = {
  inviteUsers,
  getInfoFromGroup,
  inviteUserToGroup
};