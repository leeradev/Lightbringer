# Frequently Asked Questions
If your question/problem is not answered here, feel free to send me a friend request (`Bobby#4287`) and hit me up with your questions through DMs.

- `ERROR: There are no scenarios; must have at least one.`
> This occurs if you install Yarn incorrectly on Linux.  
Please read the [official Yarn installation instructions for Linux](http://yarnpkg.com/en/docs/install#linux-tab).

- `Error: Cannot find module './config.json'`
> This means you did not set up the `config.json` for the bot.  
Please read the [Lightbringer installation instructions](https://github.com/BobbyWibowo/Lightbringer#installing).

- My game isn't showing after using `lbsetgame`!
> This isn't a bug, it's just how Discord works. It can't be fixed.  
Don't worry, your game shows for everyone else. If you want to check your game, just use `lbuserinfo`.

- `Error: Cannot find module './docs'`
> This is a bug with mathjs module, though it's still unclear whether it's caused by yarn or the module itself. To solve this, you'll have to download the files in `https://github.com/josdejong/mathjs/tree/4e1142a1/lib/expression/docs`. You can use [this tool](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/josdejong/mathjs/tree/4e1142a1/lib/expression/docs) to download them. Once you have downloaded the file, extract its content to `Lightbringer/node_modules/mathjs/lib/expression/docs`.
