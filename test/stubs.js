const group = {
  _: 'chat',
  id: 261891709,
  title: 'group',
  access_hash: '6546565654656'
};

const megaGroup = {
  _: 'channel',
  megagroup: true,
  id: 261891709,
  title: 'megagroup',
  access_hash: '423434343434'
};

const channel = {
  _: 'channel',
  id: 261891709,
  title: 'channel',
  access_hash: '243243434234'
};

const chatFull = { 
  _: 'messages.chatFull',
  full_chat: { 
    _: 'chatFull',
    id: 261891709,
    participants: { 
      _: 'chatParticipants',
      chat_id: 261891709,
      participants: [Array],
      version: 8 
    },
    chat_photo: { _: 'photoEmpty', id: '0' },
    notify_settings: { 
      _: 'peerNotifySettings',
      flags: 1,
      show_previews: true,
      mute_until: 0,
      sound: 'default' },
      exported_invite: { _: 'chatInviteEmpty' },
      bot_info: [ [Object] ] },
    chats: [ { 
      _: 'chat',
      flags: 0,
      id: 261891709,
      title: 'test_donor',
      photo: [Object],
      participants_count: 3,
      date: 1523014016,
      version: 8 } ],
    users: [ {
      _: 'user',
      flags: 49163,
      id: 5687329233,
      access_hash: '12303220788904183270',
      first_name: 'testBot',
      username: 'test',
      bot_info_version: 4 
    }] 
};

const groupParticipants = { 
  _: 'channels.channelParticipants',
  count: 1,
  participants: [
  { _: 'channelParticipant', user_id: 130819848, date: 1523614239 },
  ],
  users: [ 
    { _: 'user',
       flags: 111,
       id: 130819848,
       access_hash: '1595174272086182591',
       first_name: 'Andrew',
       last_name: 'Golubev',
       username: 'AndrewGolubev',
       photo: [Object],
       status: [Object] 
    }
  ]   
};

const inviteUpdate = {
  _: 'updates',
  updates: [{
    _: 'updateChannel',
    channel_id: 353232
  }],
  chats: [],
  users: []
};

module.exports = {
  group,
  megaGroup,
  channel,
  chatFull,
  groupParticipants,
  inviteUpdate
};