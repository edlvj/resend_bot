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

let documentMessage = {
  message_id: 1191,
  from: [],
  chat: [],
  date: 1524033944,
  document: {
    file_id: 1
  }
}

let photoMessage = {
  message_id: 1191,
  from: [],
  chat: [],
  date: 1524033944,
  photo: [
  {file_id: 1},
  {file_id: 1},
  {file_id: 1}] 
}

let textMessage = {
  message_id: 1191,
  from: {
    id: 1234
  },
  chat: {
    id: 1234
  },
  date: 1524033944,
  text: 'heelo'
};  

let statedMessage = {
  _: 'messages.statedMessage', 
  message: {}, 
  chats: [], 
  users: []
};

let chats = [
  { _: 'channel',
    flags: 9472,
    megagroup: true,
    democracy: true,
    id: 1278903495,
    access_hash: '7646293875888413565',
    title: 'Весна 2018',
    photo: { _: 'chatPhoto', photo_small: [], photo_big: [] },
    date: 1523353684,
    version: 0 },
  { _: 'chat',
    flags: 96,
    deactivated: true,
    id: 278566691,
    title: 'лето 2018',
    photo: { _: 'chatPhoto', photo_small: [], photo_big: [] },
    participants_count: 10,
    date: 1508766626,
    version: 11,
    migrated_to: 
     { _: 'inputChannel',
       channel_id: 1278903495,
       access_hash: '7646293875888413565' } },
  { _: 'channel',
    flags: 9536,
    megagroup: true,
    democracy: true,
    id: 1288542867,
    access_hash: '1899182489039619949',
    title: 'Тендеры на разработку сайтов',
    username: 'webtender',
    photo: { _: 'chatPhoto', photo_small: [], photo_big: [] },
    date: 1523523709,
    version: 0 },
  { _: 'chatForbidden',
    id: 237718865,
    title: 'Тендеры на разработку сайтов' },
  { _: 'chat',
    flags: 9,
    creator: true,
    admins_enabled: true,
    id: 255217342,
    title: 'Весна 2018',
    photo: { _: 'chatPhotoEmpty' },
    participants_count: 4,
    date: 1522670101,
    version: 18 }
];

module.exports = {
  group,
  megaGroup,
  channel,
  chatFull,
  groupParticipants,
  inviteUpdate,
  textMessage,
  photoMessage,
  documentMessage,
  statedMessage,
  chats
};