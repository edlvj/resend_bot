Before use bot don't forget add him as admin to the group.
And create config.js file with your credentials
```js

module.exports = {
  TelegramAppId: 11111,
  TelegramAppHash: "string",
  TelegramBotApiKey: "string",
  DatabasebUrl: "mongodb://127.0.0.1/resend_bot"
}

```

Run 
```js

node authorize.js

```
for getting storage.json



enter /chats +
List of current user chats

enter /list
List of publishers

enter /set <from_chat_id> <to_chat_id>
Set Publisher and subscriber

enter /drop <publisher_id>
Destroy publisher

enter /invite <chat_id> <to_chat_id>
Invite user from chats

enter /invite_logs <to_group_id>
For read log about user added to group

enter /help +
All commands

Not implemented

enter /owner 
TelegramApi session owner