# smash-twitch-banlist

[![Greenkeeper badge](https://badges.greenkeeper.io/haganbmj/smash-twitch-banlist.svg)](https://greenkeeper.io/)

## Goal
Shared twitch banlist for large smash streams.

Ban across chats for channels/events with multiple streams.

## TODOs
- Error handling. Handling disconnects, etc.
- Server config to auto-restart/connect.
- Figure out a better way to handle username casing on twitch...
- Persist bannedUsernames and eventual admin changes.
- Persist channel list to reconnect on restart.
- Store banned usernames with timestamps, who banned, etc once there's a db in place to handle that extra info. Really don't want to increase the load on username checking.
- Add a !join command or something to allow joining your channel.
- Determine if tmi.js is more efficient at joining multiple irc channels despite having a hell of a lot more message processing.
- Decide if permabans are worth managing, seems like that would be a bit too permenant since those write to the profile. Increasing the ban timeout to some ridiculous number should be enough to ban someone for an entire event.
- Add per channel ignores allowing a channel to opt out of banning someone.
- Determine how relevant a cluster would be to distribute channels across multiple threads? Seems like the load is low enough to handle for now.
- Simple message parsing in case more commands are needed. Detecting 'admins' permit to add to the list and moderators permit to allow/revoke per channel?
  + ban [username], unban [username], join [channel], leave [channel], allow [username], revoke [username] ?
  + With the intent of allow/revoke being to add per channel exclusions.
- Make some kind of frontend with a listing of banned users and some instructions.
- Deploy it.

Proof of Concept log using some top channels for a chat stream, message counts were emit every 15 seconds.

```
Joined channel: #shroud
Joined channel: #arteezy
Joined channel: #drdisrespectlive
Joined channel: #summit1g
Joined channel: #geekandsundry
149 messages processed.
BANNED username: nactalia, channel: #summit1g
252 messages processed.
346 messages processed.
451 messages processed.
556 messages processed.
618 messages processed.
BANNED username: linsp, channel: #arteezy
702 messages processed.
776 messages processed.
BANNED username: linsp, channel: #arteezy
893 messages processed.
BANNED username: linsp, channel: #arteezy
983 messages processed.
1053 messages processed.
BANNED username: nactalia, channel: #summit1g
1112 messages processed.
1166 messages processed.
1290 messages processed.
1347 messages processed.
1412 messages processed.
1460 messages processed.
1520 messages processed.
1583 messages processed.
1640 messages processed.
1692 messages processed.
```


## Development

Create a `.env` file using the params specified in `.sample-env`. You can get an oauth token [here](http://twitchapps.com/tmi/).
