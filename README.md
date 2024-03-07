# Credit
This repository is built upon [`feralhosting/feralhosting.github.io`](https://github.com/feralhosting/feralhosting.github.io).

# Use Cases
The Manuskript Worm Wordsmith is developed for a very specific use case: converting Manuskript markdown code to BBCode for websites such as Spacebattles. Its practical use will primarily be limited to creative writing for Spacebattles (SB), as well as SV and QQ. You can convert any text, but currently, it's tailored for Wormfics.

You can get Manuskript [here](https://github.com/olivierkes/manuskript). Alternatively, you can use a plain-text editor if you're more interested in the PHO and Shardspeak conversion.

# Workflow
Using this tool is straightforward: simply copy the code from the Manuskript text field and insert it into the top text field of the Manuskript Worm Wordsmith. Then, copy the converted BBCode from the bottom text field and insert it into Spacebattles (or whichever platform you use), and enjoy.

However, if that were all there was to this tool, tools like [<feralhosting.github.io>](https://feralhosting.github.io/) would be enough on their own. So, let's delve deeper into the more ultra-specialized content.


## PHO Interludes
There are at least two tools that I know of that can help you generate BBCode for a PHO interlude. These tools didn't meet my needs because they are not conversion tools; they are PHO interlude wizards where you craft the interlude like Lego blocks or a no-code flowchart. I wanted a tool that could convert my writing into a readable interlude, so I built it on top of the Feralhosting Markdown to BBCode converter.

Another feature that I implemented is using **time** in PHO messages by utilizing the `[abbr][/abbr]` tags. The time is not visible by default, but you can hover your mouse over the date, and the time will be displayed. I thought it would be a great feature to add an extra meta-dimension.

To write an interlude for conversion into a PHO scene, use command directives—wrappers and one-liners—and simply write as you go. All command directives must start from a new line.

Wrappers enclose a single block of data, while one-liners provide granular control and contain tab-separated data chunks.

### Directives
- **PHO Interlude ... EOPHO Interlude**: This directive activates PHO interlude mode. It's very likely that `PHO Interlude` will be the first line in a scene, while `EOPHO Interlude` will be the last.
- **SETTINGS ...**: A crucial one-liner containing the most important metadata.
  - **reader**: The person who is logged in and reading PHO. If the welcome message is not used, this serves no purpose.
  - **posts**: The number of posts on the page.
  - **messages**: The number of messages in PM. Not implemented.
  - **date**: The datetime of the original post. If it's just the date, the time of the post will be 12 AM.
  - **startpage**: The first page being read.
  - **endpage**: The last page of the thread. If the number of messages on the last page being read is less than `posts` and `endpage` is larger than the last page number, this will cause pagination bugs. If the end page number is smaller, it will be adjusted to match the maximum value.
  - **addpages**: Unlike `endpage`, this adds *n* pages to the effective last page. The same limitations as `endpage` apply.
  - **refer**: Use `refer:1` if you plan to use advanced referrals in the thread.
  - **noabbr**: Use `noabbr:1` to disable timestamps in the generated code. Essentially, while the Manuskript Worm Wordsmith will know the exact time of each message, the output will only have the plaintext date, similar to any other PHO Interlude generator.
  - **timeZone**: The timezone of the reader. If not specified, `America/New_York` will be used by default. Only valid timezone strings will be processed correctly. 
- **USERS ... EOUSERS**: Use this to describe users. This is optional but can be quite handy. You can enumerate all users in this block, but it's not practical unless you want to tag them or use aliases. When adding a user, press `<tab>` (ensure you get the tabulation character and not several spaces), then type either `aliasFor:othername` or `tag:some sort of tag`.
  - **aliasFor**: The name used in the thread is an alias. It will be replaced by the value of `aliasFor`.
  - **tag**: Add a tag to the user name. You can use more than one tag. If you use both `tag` and `aliasFor`, the tags should transfer to the aliased name.
- **WELCOME**: Just prints a welcome message. No parameters. You generally need only one welcome message per scene, even if you have multiple threads. But if you want, you can print several messages. 
- **THREAD ... EOTHREAD**: Contains your entire interlude.
  - **TOPIC ...**: The topic of the thread. You may use BBCode if you want. I personally find that it's a good place for `[anchor]ANCHOR[/anchor]`. This will make the topic available for navigation, allowing you to click a pseudo-link to jump to the topic, adding another meta-dimension to your thread.
  - **BOARD ...**: The board where the topic is located. Use `=>` to separate boards. This will be converted into ►.
  - **POSTER ...**: The username of the poster.
  - **BOOP ... EOOP**: The original post. Contains nothing other than the post text.
  - **REPLIES ... EOREPLIES**: Essentially the thread itself, the main reason why the Manuskript Worm Wordsmith exists. Read more in the subsection below.

### Parsing replies
#### Separating replies
The messages in **REPLIES ... EOREPLIES** are separated by lines that consist of asterisks only and have at least three asterisks. I.e.:
```markdown
REPLIES
CODE FOR MESSAGE 1
****
CODE FOR MESSAGE 2***
STILL CODE FOR MESSAGE 2
***STILL CODE FOR MESSAGE 2
**
STILL CODE FOR MESSAGE 2
***
CODE FOR MESSAGE 3
EOREPLIES
```
#### Message structure
A PHO message consists of two parts: the metadata string and the message proper. Metadata are separated from the message proper by lines that consist of dashes only and have at least three dashes. I.e.:
```markdown
REPLIES
METADATA FOR MESSAGE 1
--------
MESSAGE 1
***
METADATA FOR MESSAGE 2
-------STILL METADATA FOR MESSAGE 2
--
STILL METADATA FOR MESSAGE 2
-----
MESSAGE 2
EOREPLIES
```
The metadata must include at least one element: the **username**.

At the very basic level, a thread should look like the provided example. 
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
This is a minimal working example. If a user is defined in the **USERS ... EOUSERS** section and has tags, those tags will be used. If the username is an alias for a name, that name will be used.

While the username is the only required piece of metadata, there are several other types available:
  * username (any sequence of characters except `\t`)
  * tag (`tag:` + any sequence of characters except '\t'. Use repeatedly to add more than one tag)
  * untag (`untag:` + any sequence of characters except '\t'. Use repeatedly to remove more than one tag)
  * page (`page:` + integer)
  * time offset (`+<number><s|m|h|d>`)
  * exact timestamp (`=` + ISO 8601 string. Overrides time offset)
  * message ID (`id:` + any alphanumeric character, '_' or '-')
  * referral (`refer:` + any alphanumeric character, '_' or '-')

Metadata are separated by the `\t` character (`<tab>`), but ensure that you are using the tabulation character when pressing `<tab>` and not several space characters. Some editors type a sequence of spaces instead of a single `\t` (e.g., the Markdown editor on GitHub types two spaces instead of one `	`). Anything other than `\t` is considered part of the previous metadata.

To sum it all up, a metadata string for a message looks like this:

```markdown
Username	tag:Verified Cape	tag:Protectorate	+10m  refer:23	id:curious-reply
```
Now, let's delve into metadata other than the username in more detail.

##### Tag
`tag` adds tags.  For example, instead of declaring `Pyke	tag:Tinker` in **USERS ... EOUSERS**, you can write `Pyke	tag:Tinker` in the message metadata. This and all subsequent messages by Pyke will be tagged "Tinker". You can use this metadata simply to introduce a character, but the intended effect is that the tag is *not* used on the user *until* they are tagged later in the thread. This is mostly for Banned and Temp-banned users.

This mechanism becomes a bit tricky when using advanced references (covered in more detail below) since the tag is applied *chronologically* to the message that you tag and all later messages. It's not really a bug because, for example, when a character is awarded a tag in a certain message, you want the chronological propagation and not propagation based on the order of the messages in the source code.

You don't have to worry about that if you are not using advanced references, since, in that case, the chronological order and the order of messages in the source Markdown code are the same. Make sure to proofread the thread after conversion.

##### Untag
Similar to `tag`, but `untag` removes a tag for the current message and all later messages.

##### Page
This feature resets the current page to a specified page. It's a bit tricky and could use some tweaks. For now, all you need to know is that if the number of replies on a page is less than the value of `replies per page`, pagination might be glitchy.

##### Time Offset

The Manuskript Worm Wordsmith can interpret basic timecodes, such as `+21s` (add 21 seconds), `+2m` (add 2 minutes), `+2h` (add 2 hours), and `+7d` (add 7 days). By default, the timecode offsets the time of the message from the time of the *latest previous* message. The converter will always offset the time by a pseudorandom number of seconds in addition to whatever offset you specify, except when you explicitly specify the number of seconds, such as `+0s`. If you don't specify an explicit number of seconds, the number of seconds should still be consistent between different runs since the converter uses a sine generator with the initial timestamp as the seed. Changing the initial timestamp will alter the pseudorandom offsets.

##### Exact Timestamp
You can specify the exact time of the message by using an ISO 8601 timestamp with the "=" prefix, for example, `=2011-02-04T12:00:00-05:00`. Specifying an earlier time than any of the previous messages will not affect the other messages' offsets since:
* If you have advanced referring enabled, you must explicitly refer to the message to offset from it.
* If you don't have advanced referring enabled, messages offset from the latest previous message, which won't be the timestamped message if it's set to an earlier time than any previous message.

##### Advanced Referring

To enable this mode, you must have `refer:1` specified in **SETTINGS...**.

By default, messages offset from the latest previous message. This is straightforward, but it makes tracking branching conversations and especially realistic time delays challenging. In advanced referring mode, you're keeping track of who answers whom. You may insert new replies in the middle of the conversation by appending them to your conversation log while offsetting from the original post or specifying a timestamp. You can have multiple characters react to the same event at roughly the same time. It's really up to you and your willingness to handle a large non-linear chunk of text.

There are two special metadata: `id` and `refer`. If you don't have `refer:1` specified in **SETTINGS...**, they don't do anything.

The usage of `id` is simply for marking the message with that id to refer to it later. When you use `refer` with the value of an id, you are offsetting from the message last marked by that ID. If you don't specify `refer` in the message metadata but you still have `refer:1` in the settings, you are offsetting from the original post's timestamp until you use the special id "latest". When you use `refer:latest`, you are offsetting from the latest message, and that message becomes the default message for offsetting for all future replies. Even then, you can still offset from the OP by using `refer:0`.


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

### Possible Issues
* If you are using advanced mode and the last message in the conversation reads `Invalid Date` instead of a date, it's because it refers to a non-existent message ID, or the message with the ID is missing a tabulation character.
* If a control sequence is visible in the generated conversation, the metadata is not properly separated from the username. If that's a time offset, a timestamp, or `refer`, the message will be out of order as well.
* If a message is out of order, it may be due to:
  * An invalid time offset.
  * An invalid timestamp.
  * A missing tabulation character.
  * A space character after the tabulation character.
  * Missing `refer:` metadata.
  * The ID it refers to was overwritten.
  * It's where it should be; you just didn't expect that. Adjust the offset or use a timestamp.
