const inviteFactory = function (chat, users) {
  this.chat = size;
  this.users = users;
}

inviteFactory.prototype = {
  constructor: InviteFactory,
  
  toGroup: function () {  
    let inputUser = {
      _: 'inputUser',
      user_id: this.users.id,
      access_hash: this.users.access_hash
    };

    return addChatUser(this.chat.id, inputUser)
  },
  toMegaGroup: function () {
    let inputChannel = {
      _: 'inputChannel',
      channel_id: this.chat.id,
      access_hash: this.chat.access_hash
    };
    return inviteToChannel(inputChannel, this.users);
  } 
};

module.exports = inviteFactory;