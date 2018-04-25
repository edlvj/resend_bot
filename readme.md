Before use bot don't forget add him to the group.
And create /lib/config/index.js file with your credentials
```js

module.exports = {
  TelegramAppId: 11111,
  TelegramAppHash: "string",
  TelegramBotApiKey: "string",
  DatabasebUrl: "mongodb://127.0.0.1/resend_bot"
}

```
And run
npm start

enter /auth
User Auth

enter /chats
List of current user groups and channels

enter /list
List of publishers

enter /add
Set Publisher and subscriber

enter /drop
Destroy publisher

enter /invite
Invite user from chats