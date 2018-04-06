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

enter /chats
List of current user chats

enter /add_publisher <chat_id> <to_chat_id>
Set Publisher for read

enter /publishers
List of publishers

enter /drop_publisher <publisher_id>
Destroy publisher

enter /invite_users <group_id> <to_group_id>
Set Publisher for read

enter /invite_logs <to_group_id>
For read log about user added to group

enter /status
Check Telegrambot and TelegramApi session
