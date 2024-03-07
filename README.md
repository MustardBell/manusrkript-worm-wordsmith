# Use Cases
This repository has been forked from `[https://github.com/feralhosting/feralhosting.github.io](feralhosting/feralhosting.github.io)` and developed for a very specific use case: the conversion of Manuskript markdown code to BBCode for websites such as Spacebattles. Its practical use will primarily be limited to creative writing for Spacebattles (SB), and probably SV and QQ.

You can download Manuskript [here](https://github.com/olivierkes/manuskript). You can also use a plain-text editor if you are more interested in the PHO and Shardspeak conversion.

# Workflow
Using this tool is straightforward: simply copy the code from the Manuskript text field and insert it into the top text field of the converter. Then, copy the converted BBCode from the bottom text field and insert it into Spacebattles (or whichever platform you use) and enjoy.

However, if that were all there was to this tool, there would be no need to fork it from Feralhosting. It would be sufficient on its own. So, let's delve deeper into the more ultra-specialized content.

## PHO Interludes
There are at least two tools that I know of that can help you generate BBCode for a PHO interlude. These tools didn't meet my needs because they are not true conversion tools; they are PHO interlude wizards where you craft the interlude like Lego blocks or a no-code flowchart. I wanted a tool that could convert my writing into a readable interlude, so I built it on top of the Feralhosting Markdown to BBCode converter.

To write an interlude for conversion into a PHO scene, use command directives—wrappers, and one-liners—and simply write as you go. All command directives must start from a new line, with the exception of reply metadata, as the username can be considered a one-line command directive.

Wrappers enclose a single block of data, while one-liners provide granular control and contain tab-separated data chunks.

### Directives
- **PHO Interlude ... EOPHO Interlude**: This directive activates PHO interlude mode. It's very likely that `PHO Interlude` will be the first line in a scene, while `EOPHO Interlude` will be the last.
- **SETTINGS**: A crucial one-liner containing the most important metadata.
  - **reader**: The person who is logged in and reading PHO. If the welcome message is not used, this serves no purpose.
  - **posts**: The number of posts on the page.
  - **messages**: The number of messages in PM. Not implemented.
  - **date**: The datetime of the original post. If it's just the date, the time of the post will be 12 AM.
  - **startpage**: The first page being read.
  - **endpage**: The last page of the thread. If the number of messages on the last page being read is less than `posts` and `endpage` is larger than the last page number, this will cause pagination bugs. If the end page number is smaller, it will be adjusted to match the maximum value.
  - **addpages**: Unlike `endpage`, this adds n pages to the effective last page. The same limitations as `endpage` apply.
  - **refer**: Use `refer:1` if you plan to use advanced timecodes in the thread.
- **USERS ... EOUSERS**: Use this to describe users. This is optional but can be quite handy. You can enumerate users in this block, but it's not practical unless you want to tag them or use aliases. When adding a user, press `<tab>` (ensure you get the tabulation character and not several spaces), then type either `aliasFor:othername` or `tag:some sort of tag`.
  - **aliasFor**: The name used in the thread is an alias. It will be replaced by the value of `aliasFor`.
  - **tag**: Add a tag to the user name. You can use more than one tag. If you use both `tag` and `aliasFor`, the tags should transfer to the aliased name.
- **WELCOME**: Just prints a welcome message. No parameters. 
- **THREAD ... EOTHREAD**: Contains your entire interlude.
  - **TOPIC**: The topic of the thread. You may use BBCode if you want. I personally find that it's a good place for `[anchor]ANCHOR[/anchor]`. This will make the topic available for navigation, allowing you to click a pseudo-link to jump to the topic, adding dimension to your thread.
  - **BOARD**: The board where the topic is located. Use `=>` to separate boards. This will be converted into ►.
  - **POSTER**: The username of the poster.
  - **BOOP ... EOOP**: The original post. Contains nothing other than the post text.
  - **REPLIES ... EOREPLIES**: Essentially the thread itself, the main reason for this tool. Use asterisks (at least 3, with no other characters in the line) to separate replies. Use dashes (at least 3, with no other characters in the line) to separate the username and metadata from the replies themselves. At the very basic level, a thread should look like the provided example. 
```markdown
Pyke
------
Is it PHO, though?
*****
Maven
---------
Well, yes
****
Lung
------
I find this amusing

```
You can add codes to the usernames by adding `<tab>` characters. For example, instead of writing `Pyke` you can write `Pyke  tag:Tinker`. However, this mechanism is a bit buggy when using advanced timecodes. The intended effect is that the tag is not used on the user until they are tagged in the thread. Mostly, it's for Banned and Temp-banned users. Make sure to proofread the thread anfter conversion.

This converter can read crude timecodes, such as `+21s`, `+2m`, `+2h`, and `+7d`. The timecode offsets the time of the message from the time of the previous message if you don't have `refer` specified in the settings. But there are also two special metadata: `id` and `refer` for when you have `refer:1` specified in the settings. The converter will always offset the time by a pseudorandom number of seconds in addition to whatever offset you specified, except when you specify the exact number of seconds, such as `+0s`. The number of seconds should be consistent between different runs since the converter uses a sine generator with the initial date used as the seed.

The usage of `id` is simply for marking the message with that id to refer to it later. And if you use `refer` with an id, you are offsetting from a specific message. If you don't use `refer` and you have `refer` in the settings, you are offsetting from the OP until you use the special id "latest". When you use `refer:latest`, you are offsetting from the latest message, and that message becomes the default message for offsetting for all future replies.

You can also specify the exact time of the message by using a timestamp with the "=" prefix, for example, `=2011-02-04T12:00:00-05:00`. However, there is a limitation right now: if the timestamp is earlier than the latest message, it won't take effect.

### Sample
The provided sample demonstrates how to use the directives and structure your PHO interlude for conversion.

```markdown
PHO Interlude

SETTINGS	reader:Vaduz	posts:10	messages:10	date:2011-02-04T12:00:00-05:00	startpage:1	endpage:557  refer:1
WELCOME

USERS
Maven	aliasFor:Maven222	tag:Veteran Member
Pyke	tag:Verified Cape	tag:Tinker
Lung  aliasFor:Divine_Carp
EOUSERS

THREAD
TOPIC	Some topic[anchor]Anchor for links inside the scene[/anchor]
BOARD	Some=>Board=>Name
POSTER	Maven
BOOP
O wow, a PHO post
EOOP

REPLIES
Pyke	+2m	id:notPHO
------
Is it PHO, though?
*****
Maven	+14s	id:4	refer:notPHO id:whatever
---------
Well, yes
****
Lung	+2m	+0s
------
I find this amusing
****
User 1  =2011-02-04T12:00:01-05:00
Am I late?  No, exact time magic!

EOREPLIES
EOTHREAD

EOPHO Interlude
```
produces this
```bbcode
[CENTER]■[/CENTER]

[b]Welcome to the Parahumans Online message boards.[/b]
You are currently logged in, [u]Vaduz[/u]
You are viewing:
• Threads you have replied to
• AND Threads that have new replies
• OR private message conversations with new replies
• Thread OP is displayed.
• Ten posts per page
• Last ten messages in private message history.
• Threads and private messages are ordered chronologically.
[CENTER]■[/CENTER]


[b]♦ Topic: Some topic[anchor]Anchor for links inside the scene[/anchor][/b]
[b]In: Boards ► Some ► Board ► Name[/b]
[b]Maven222 [/b] (Original Poster)  (Veteran Member) 
Posted on [abbr="02/04/2011, 12:00:00 PM Eastern Time"]Feb 4th, 2011[/abbr]:
O wow, a PHO post

[b](Showing page 1 of 1)[/b][indent]
[b]Divine_Carp [/b]
Replied on [abbr="02/04/2011, 12:02:00 PM Eastern Time"]Feb 4th, 2011[/abbr]:
I find this amusing

[b]Pyke [/b] (Verified Cape)  (Tinker) 
Replied on [abbr="02/04/2011, 12:02:26 PM Eastern Time"]Feb 4th, 2011[/abbr]:
Is it PHO, though?

[b]Maven222 [/b] (Original Poster)  (Veteran Member) 
Replied on [abbr="02/04/2011, 12:02:40 PM Eastern Time"]Feb 4th, 2011[/abbr]:
Well, yes
[/indent]
[b]End of Page. 1[/b]
[CENTER]■[/CENTER]
```
