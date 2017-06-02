# Commands

## Fun  
### `anim`  
*Description:* `"Animates" a series of emojis`  
*Usage:* `anim [-d <delay>] <emoji> [emoji2] [...]`

### `binary`  
*Description:* `Encodes/decodes your input to/from binary`  
*Usage:* `binary <encode|decode> <input>`

### `booru`  
*Description:* `Search for booru images from various booru sites (looks for a random image from gelbooru.com by default)`   
*Usage:* `booru [-s <site>] [tag1] [tag2]`  
*Aliases:* `b`

### `fanceh`  
*Description:* `Renders text in big emoji letters`  
*Usage:* `fanceh <text>`  
*Aliases:* `fancy`, `letters`

### `feed`  
*Description:* `Force a food item down some users' throat`  
*Usage:* `feed <user-1> [user-2] ... [user-n]`

### `figlet`  
*Description:* `Renders fancy ASCII text`  
*Usage:* `figlet <text>`

### `flip`  
*Description:* `Flip text`  
*Usage:* `flip <text>`  
*Credits:* `1Computer1`

### `get`  
*Description:* `Get some things from some APIs`  
*Usage:* `get [type]`  
*Aliases:* `g`, `f`, `fetch`

### `gif`  
*Description:* `Searches Giphy for GIFs`  
*Usage:* `gif [-u] <query>`  
*Aliases:* `giphy`

### `gtime`  
*Description:* `Prints current time in yours or a particular location (using Google Maps API)`  
*Usage:* `gtime [location]`

### `insult`  
*Description:* `Insults some users`  
*Usage:* `insult <user-1> [user-2] ... [user-n]`  
*Credits:* `Twentysix#5252`

### `jumbo`  
*Description:* `Sends the emojis as image attachments`  
*Usage:* `jumbo [-k] <emojis>`  
*Aliases:* `j`, `large`

### `kill`  
*Description:* `Kills some users`  
*Usage:* `kill <user-1> [user-2] ... [user-n]`  
*Credits:* `illusorum#8235 (286011141619187712)`

### `meme`  
*Description:* `N/A`  
*Usage:* `meme list | info <name> | [<name> | <line 1> | <line 2> | [style]]`

### `random`  
*Description:* `Shows you pictures of random cats or dogs`  
*Usage:* `random [-u] <cats|dogs>`

### `reaction`  
*Description:* `Sends reaction to the previous message`  
*Usage:* `reaction <text|emoji|both>`  
*Aliases:* `react`

### `reverse`  
*Description:* `Reverses the text you input`  
*Usage:* `reverse <text>`

### `roll`  
*Description:* `rolls X dice with Y sides. Supports standard dice notation`  
*Usage:* `roll XdY <reason>`  
*Credits:* `Abyss#0473 (136641861073764352)`

### `shoot`  
*Description:* `Shoots yer friendz!`  
*Usage:* `shoot <user>`

### `sigh`  
*Description:* `Dramatic sigh text`  
*Usage:* `sigh`

### `space`  
*Description:* `Spaces out text to look all dramatic n' stuff`  
*Usage:* `space [amount] <text>`

### `spongememe`  
*Description:* `Turns a specific message into a SpongeBob meme (this command is cancerous!)`  
*Usage:* `spongememe [-t] [id] [channel]`  
*Aliases:* `sm`

### `time`  
*Description:* `Prints current time in yours or a particular location (using Time.is)`  
*Usage:* `time [location]`  
*Credits:* `1Computer1`

### `tiny`  
*Description:* `Converts your text to tiny letters!`  
*Usage:* `tiny <text>`

### `today`  
*Description:* `Gives a random thing that happened today in history from http://history.muffinlabs.com/date`  
*Usage:* `today <events|births|deaths>`

### `xkcd`  
*Description:* `Shows you random xkcd comics`  
*Usage:* `xkcd`

## Info  
### `emojis`  
*Description:* `Gets the emojis of the current guild`  
*Usage:* `emojis [-r|-f <guild name>]`

### `getos`  
*Description:* `Gets the name of the OS the bot is running on (for Linux-based system, this command will show the distro)`  
*Usage:* `getos`

### `guilds`  
*Description:* `Lists all guilds that you're a member of`  
*Usage:* `guilds`  
*Aliases:* `servers`

### `help`  
*Description:* `Shows you help for all commands or just a single command`  
*Usage:* `help all|[command]|[category <name>]`  
*Aliases:* `h`

### `inrole`  
*Description:* `Shows a list of members which have the specified role`  
*Usage:* `inrole <role name>`

### `locate`  
*Description:* `Gets the name of the guild that the emoji comes from`  
*Usage:* `locate <emoji>`

### `roleinfo`  
*Description:* `Shows info of the server you are in`  
*Usage:* `roleinfo <role name>`  
*Aliases:* `role`

### `guildinfo`  
*Description:* `Shows info of the server you are in`  
*Usage:* `guildinfo [roles|members|channels]`  
*Aliases:* `guild`, `server`, `serverinfo`

### `stats`  
*Description:* `Shows you stats about SharpBot`  
*Usage:* `stats`

### `uptime`  
*Description:* `Shows the bot's uptime`  
*Usage:* `uptime`

### `userinfo`  
*Description:* `Shows yours or another user's info`  
*Usage:* `userinfo [user]`  
*Aliases:* `info`

## Moderation  
### `clone`  
*Description:* `Clones the message with the given ID (may optionally set a channel)`  
*Usage:* `quote [id] [channel]`

### `edits`  
*Description:* `Gets all the recent edits of a particular message (depends on the bot's cache - may optionally set a channel)`  
*Usage:* `edits [id] [channel]`

### `flush`  
*Description:* `Deletes messages sent by bots`  
*Usage:* `flush <amount>`

### `getids`  
*Description:* `Get a list of message IDs (by default will get the latest 5 messages from the current channel - max amount is 50)`  
*Usage:* `getids [amount] [channel]`

### `prune`  
*Description:* `Deletes a certain number of messages sent by you`  
*Usage:* `prune [amount]`

### `purge`  
*Description:* `Deletes a certain number of messages`  
*Usage:* `purge [amount]`

### `quote`  
*Description:* `Quotes the message with the given ID (may optionally set a channel)`  
*Usage:* `quote [-c] [id] [channel]`

### `search`  
*Description:* `Searches a number of messages for some text`  
*Usage:* `search <#> <text>`

## Tags  
### `tag`  
*Description:* `Displays a saved tag (optionally append to prefix)`  
*Usage:* `tag <name> [prefix]`  
*Aliases:* `t`

### `tags`  
*Description:* `Controls or lists your shortcuts`  
*Usage:* `tags [-v] [add|delete] [name] [contents]`

## Utility  
### `avatar`  
*Description:* `Get yours or another user's avatar`  
*Usage:* `avatar [-e] [user]`  
*Aliases:* `ava`

### `dictionary`  
*Description:* `Looks up a word on Dictionary.com`  
*Usage:* `dictionary <query>`  
*Aliases:* `dict`

### `embed`  
*Description:* `Sends a message via embeds`  
*Usage:* `embed [text]`

### `eval`  
*Description:* `Evaluates arbitrary JavaScript`  
*Usage:* `eval [options] <code>`

### `exec`  
*Description:* `Executes a command in the console`  
*Usage:* `exec [-l <lang>] <command>`

### `github`  
*Description:* `Links to a GitHub repository`  
*Usage:* `github <user/repo>`  
*Aliases:* `git`

### `google`  
*Description:* `Searches Google using magic`  
*Usage:* `google <search>`

### `haste`  
*Description:* `Uploads some text to Hastebin`  
*Usage:* `haste [options] <text>`  
*Aliases:* `hastebin`

### `lmgtfy`  
*Description:* `Links to LMGTFY with the given search text`  
*Usage:* `lmgtfy [search text]`

### `mal`  
*Description:* `Search for anime info from MyAnimeList`  
*Usage:* `mal [options] <query>`  
*Aliases:* `anime`, `myanimelist`

### `math`  
*Description:* `Evaluate math expressions using mathjs library (separate individual expression by new line)`  
*Usage:* `math [options] <expressions>`  
*Aliases:* `calc`, `calculate`

### `ping`  
*Description:* `Pings the bot`  
*Usage:* `ping`

### `prefix`  
*Description:* `Sets the bot prefix`  
*Usage:* `prefix <new prefix>`

### `restart`  
*Description:* `Restarts the bot`  
*Usage:* `restart`  
*Aliases:* `res`

### `reload`  
*Description:* `Reloads all modules (or optionally reload 'utils', 'consts', 'extended')`  
*Usage:* `reload [utils|consts|extended]`  
*Aliases:* `r`

### `setgame`  
*Description:* `Sets your game (shows for other people)`  
*Usage:* `setgame <game>`

### `shortcuts`  
*Description:* `Controls or lists your shortcuts`  
*Usage:* `shortcuts [add|delete] [id] [commands]`  
*Aliases:* `sc`

### `thesaurus`  
*Description:* `Looks up a word on Thesaurus.com (showing synonyms by default)`  
*Usage:* `thesaurus [-a] <query>`  
*Aliases:* `syn`, `synonyms`

### `timezone`  
*Description:* `Converts between timezones using DuckDuckGo searches`  
*Usage:* `timezone <time> to <time>`  
*Credits:* `Abyss#0473 (136641861073764352)`

### `tmention`  
*Description:* `Toggle mentions logger in this guild`  
*Usage:* `tmention [list]`  
*Aliases:* `togglemention`

### `translate`  
*Description:* `Translates text from/to any language`  
*Usage:* `translate <lang> <text>`  
*Credits:* `Carbowix`

### `urban`  
*Description:* `Looks up a word on Urban Dictionary (leave query blank to get a random definition)`  
*Usage:* `urban [-i <index>] [query]`  
*Aliases:* `u`, `urbandictionary`

### `wiki`  
*Description:* `Returns the summary of the first matching search result from Wikipedia`  
*Usage:* `wiki <query>`  
*Aliases:* `w`, `wikipedia`
