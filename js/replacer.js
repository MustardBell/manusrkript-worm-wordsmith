function* sinePseudoRandomGenerator(seed) {
    switch (typeof seed) {
        case "string":
            seed = stringToSeed(seed);
            break
        case "number":
            break;
        default:
            seed = Math.PI
    }
    let x = Math.sin(seed++) * 10000;
    while (true) {
        x = Math.sin(x) * 10000;
        yield x - Math.floor(x);
    }
}

function stringToSeed(str) {
    let seed = 0;
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        seed = (seed << 5) - seed + charCode;
    }
    return seed;
}


class PHO {
    constructor(text) {
        this.countOP = true
        this.init(text)

    }

    init(text) {

        this.text = text

        this.users = {
            "Bagrat": {
                "tag": [
                    "Original Poster",
                    "Veteran Member",
                    "The Guy in the Know"
                ]
            },
            "XxVoid_CowboyxX": {},
            "xVCx": {
                "aliasFor": "XxVoid_CowboyxX"
            },
            "Reave": {
                "tag": [
                    "Verified PRT Agent"
                ]
            },
            "Alathea": {
                "tag": [
                    "Moderator"
                ]
            },
            "Huskie": {
                "aliasFor": "◄HuskieWakeupCall"
            },
            "◄HuskieWakeupCall": {},
            "Lung": {
                "aliasFor": "Divine_Carp"
            },
            "Divine_Carp": {},
            "Brocktonite03": {
                "tag": [
                    "Veteran Member"
                ]
            },
            "Crazy": {
                "aliasFor": "Master of Truth"
            },
            "Master of Truth": {
                "tag": [
                    "Temp-banned"
                ]
            },
            "Armsmaster_Protectorate_ENE_Official": {
                "tag": [
                    "Verified Cape",
                    "Protectorate ENE"
                ]
            },
            "Armsmaster": {
                "aliasFor": "Armsmaster_Protectorate_ENE_Official"
            },
            "Mod": {
                "aliasFor": "Alathea"
            },
            "Meander": {
                "tag": [
                    "Verified PRT Agent"
                ]
            },
            "Xenology Geek": {
                "tag": [
                    "Scientifically accurate UFOlogist"
                ]
            }
        }
        this.settings = {}

        this.settingsRegex = /(?:^|[\n\r])SETTINGS\b([^\n]*)(?:$|[\n\r])/m;
        this.usersRegex = /(?:^|[\n\r])USERS([\s\S]*?)[\n\r]EOUSERS(?:$|[\n\r])/m;
        this.threadRegex = /(?:^|[\n\r])THREAD\s*([\s\S]*?)[\n\r]EOTHREAD(?:$|[\n\r])/m;
        this.welcomeRegex = /(?:^|[\n\r])WELCOME[\t ]*(?:$|[\n\r])/m;

        this.topicRegex = /(?:^|[\n\r])TOPIC\t([^\n]*)(?:$|[\n\r])/m;
        this.boardRegex = /(?:^|[\n\r])BOARD\t([^\n]*)(?:$|[\n\r])/m;
        this.posterRegex = /(?:^|[\n\r])POSTER\t([^\n]*)(?:$|[\n\r])/m;
        this.timeRegex = /(?:^|[\n\r])TIME\t([^\n]*)(?:$|[\n\r])/m;

        this.OPRegex = /(?:^|[\n\r])BOOP([\s\S]*?)[\n\r]EOOP(?:$|[\n\r])/m;
        this.repliesRegex = /(?:^|[\n\r])REPLIES([\s\S]*?)[\n\r]EOREPLIES(?:$|[\n\r])/m;


        this.replySeparator = /^\*\*+$/m;

        this.allRegexes = new RegExp(`(${this.settingsRegex.source})|(${this.usersRegex.source})|(${this.welcomeRegex.source})|(${this.threadRegex.source})`, 'gm');
        return this
    }

    extractBoard(string) {
        const threads = ['In: Boards', ...string.split('=>')].filter(n => n);
        return threads.join(' ► ')
    }

    extractPoster(poster) {
        if (this.users[poster]?.aliasFor) {
            const originalName = this.users[poster]?.aliasFor
            if (this.users[poster]?.tag) {
                if (this.users[originalName]?.tag) {
                    this.users[originalName].tag = [...this.users[originalName].tag, ...this.users[poster].tag]
                } else {
                    if (!this.users[originalName]) this.users[originalName] = {}
                    this.users[originalName].tag = [...this.users[poster].tag]
                }

            }
            return this.extractPoster(originalName)
        }

        const posterTag = 'Original Poster'
        if (!this.users[poster]) this.users[poster] = {}

        if (!this.users[poster].tag) {
            this.users[poster].tag = [posterTag]
        } else if (this.users[poster].tag[0] !== posterTag && !this.users[poster].tag.includes(posterTag)) {
            this.users[poster].tag.unshift(posterTag)
        }

        return this.extractUser(poster, false, this.settings.dateOP)
    }

    formatUser(user, reply) {
        const formatted = `\n[b]${reply ? '►' : ''}${user} [/b]`
        return formatted

    }

    extractUser(user, reply = true, date) {
        //  console.log(user)
        //  console.log(this.users[user])
        user = user.trim()
        // console.log(this.users[user])

        if (!this.users[user]) return this.formatUser(user, reply)
        //if (this.users[user]?.aliasFor) return this.extractUser(this.users[user]?.aliasFor)
        if (this.users[user]?.aliasFor) {
            const originalName = this.users[user]?.aliasFor
            if (this.users[user]?.tag) {
                if (this.users[originalName]?.tag) {
                    this.users[originalName].tag = [...this.users[originalName].tag, ...this.users[user].tag]
                } else {
                    if (!this.users[originalName]) this.users[originalName] = {}
                    this.users[originalName].tag = [...this.users[user].tag]
                }

            }
            return this.extractUser(originalName, reply, date)
        }
        let formatted = this.formatUser(user, reply)
        if (!this.users[user]?.tag) {
            //console.error(this.users[user])
            return formatted
        }
        let tags = this.users[user].tag
        tags = tags.map(t => {
            const [tag, datetime] = t.split(":::")
            if (!datetime) return t
            if (datetime > date.getTime()) return null
            return tag
        }).filter(n => n)
        tags = Array.from(new Set(tags))
        tags = tags.map(n => ` (${n}) `)
        tags = tags.join("") ?? ""
        return formatted + tags

    }

    extractOP(text) {
        const match = this.OPRegex.exec(text)?.[1]
        if (!match) return "";
        return match.trim();

    }

    processSettings(text) {
        const match = this.settingsRegex.exec(text)?.[1]
        if (!match) return null;
        //log(`Processing SETTINGS: ${match}`);
        this.extractSettings(match)
        return ``;
    }

    processUsers(text) {
        const match = this.usersRegex.exec(text)?.[1];
        if (!match) return null;
        //   console.log(`Processing USERS: ${match}`);
        this.extractUsers(match)
        return ``;

    }


    processWelcome(text) {
        const isOk = this.welcomeRegex.test(text)
        if (!isOk) return null;
        //  console.log(`Processed WELCOME`);
        return this.makeGreeting();

    }

    processBoard(text) {
        const match = this.boardRegex.exec(text)?.[1]
        if (!match) return 'Boards';
        //    console.log(`Processing BOARD: ${match}`);
        return '[b]' + this.extractBoard(match) + '[/b]'
    }

    processTopic(text) {
        return "[b]♦ Topic: " + (this.topicRegex.exec(text)?.[1]?.trim() ?? 'A question') + '[/b]';
    }

    processPoster(text) {
        const match = this.posterRegex.exec(text)?.[1]
        if (!match) return 'Original Poster';
        //log(`Processing POSTER: ${match}`);
        return match

    }

    processReplies(text) {
        const match = this.repliesRegex.exec(text)?.[1]
        if (!match) return 'No replies';
        //  console.log('Processing replies')

        const replies = match.split(this.replySeparator)
        const randomGenerator = sinePseudoRandomGenerator(this.settings.dateOP?.getTime());

        function rnd() {
            return randomGenerator.next().value;
        }
        function extract(regex,data){
             if (regex.test(data)) {
                const [, match, error] = regex.exec(data)
                if (error) throw new Error("Regex returned more than one match. Stopping now. Extra match: "+match)
                //console.error("Extracted from "+data+" using "+regex)

                return match;
            }
            return null;
        }
        const previousReplies = new Map()
        previousReplies.set(0,new Date(this.settings.date))
        previousReplies.set("0",new Date(this.settings.date))
        previousReplies.set(null,new Date(this.settings.date))
        const timeRegex = /^\+(\d+|rnd)([mhsd])/
        const stampRegex = /^=([^\n\t\r ]+)/
        const tagRegex = /^tag:(.+)\n?/
        const untagRegex = /^untag:(.+)\n?/
        const resetPageRegex = /^page:(\d+)/
        const idRegex = /^id:([0-9A-Za-z_-]+)/
        const referPageRegex = /^refer:([0-9A-Za-z_-]+)/

        let latestDate = this.settings.date

        const processedReplies = replies.map(reply => {
            const displacement = {}

            let [metadata, text] = reply.split(/^---+$/m)
            let [user, ...meta] = metadata.split('\t');

            user = user.trim()
            console.groupCollapsed(user)

            let page

            let id = 0; //main thread ID
            let prevId = 0; //main thread ID
            let stamp
            for (const data of meta) {
                id||= extract(idRegex,data);
                prevId||= extract(referPageRegex,data);
                page||= extract(resetPageRegex,data)
                stamp||=extract(stampRegex,data)
                if (timeRegex.test(data)) {
                    let [, offset, type] = timeRegex.exec(data)
                    if (offset === 'rnd') {
                        offset = Math.floor(rnd() * 59) + 1
                    }
                    displacement[type] = offset

                }
               
            }

            let referenceDate = new Date(previousReplies.get(prevId)) // First message will set to this.settings.date
            if (prevId==='latest' || !this.settings.refer) {
               referenceDate = new Date(latestDate)
               previousReplies.set(null,new Date(latestDate))
            }
            console.log('new Date(referenceDate)')
            console.log(this.getReadableTimeStamp(new Date(referenceDate)))
            console.log('prevId')
            console.log(prevId)
            console.log('id')
            console.log(id)
            console.log('referenceDate obj')
            console.log(this.getReadableTimeStamp(referenceDate))
            console.log('displacement')
            console.log(displacement)
            
            // Set offsets
            if (!isNaN(new Date(stamp) ) && new Date(stamp) > referenceDate) {referenceDate = new Date(stamp) } else {

            this.applyDisplacement(displacement, referenceDate);}
            console.log('days ofset')
            console.log(this.getReadableTimeStamp(new Date(referenceDate)) )           

            const date = new Date(referenceDate)
            previousReplies.set(id ?? null, date)
            for (const data of meta) {
                const tag= extract(tagRegex,data)
                const untag= extract(untagRegex,data)
                if (tag) {
                    const offsetTag = tag + ":::" + date.getTime()
                    if (!this.users[user]) this.users[user] = {}
                    if (!this.users[user].tag) {
                        this.users[user].tag = [offsetTag]
                        continue
                    }
                    if (!this.users[user].tag.some(t => t===tag || t.includes(tag+":::"))) {
                        this.users[user].tag.push(offsetTag);
                    }
                }
                if (untag) {
                    if (this.users[user]?.tag) {
                        this.users[user].tag = this.users[user].tag.filter(n => n!==untag && !n.includes(untag+":::"))
                        continue
                    }
                }         

            }
            if (latestDate < date) latestDate = new Date(date)

            text = text.replace(/(?<=[^|\b])@([a-zA-Z0-9_-]+(?=\b|$))/gm, (match, group) => {
                const user = this.users[group]?.aliasFor ?? group;
                return `@${user}`

            })
            text = text.replace(/(?<=[^|\b])@([^\n>]+)>(.+$)/gm, (match, user, quote) => {

                return !quote ? `@${user}` : `\n[fieldset title="${user} said:"]${quote}[/fieldset]`

            })
            text = text.replace(/\@/g, '[plain]@[/plain]')
            text = text.trim()

            text = text.replace(/^(?=\[field)/, "\n")
            text = mdToBBCode(text)
            text += '\n'
            const replyObject = {
                text, user, date, page, displacement, id, prevId
            }
            console.log(replyObject)
            console.groupEnd()
            return replyObject
        })
        console.log("PROCESSED REPLIES")
        console.log(processedReplies)
        for (const reply of processedReplies) {
            console.log(reply)
        }

        if (this.countOP && this.settings.startpage === 1) processedReplies.unshift(null)
        console.log(processedReplies)
        for (const reply of processedReplies) {
            console.log(reply)
        }
        return processedReplies.sort(function (a, b) {
            // Convert the date strings to Date objects for comparison
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            // Compare the dates
            return dateA - dateB;
        });

    }


    applyDisplacement(displacement, referenceDate) {
        if (displacement.s) {
            referenceDate.setUTCSeconds(Number(referenceDate.getUTCSeconds()) + Number(displacement.s));
        } else if (displacement.s === undefined) {
            const offset = Math.floor(Math.random() * 14) + 15;
            referenceDate.setUTCSeconds(Number(referenceDate.getUTCSeconds()) + offset);
        }
        console.log('seconds ofset');
        console.log(this.getReadableTimeStamp(new Date(referenceDate)));
        if (displacement.m) {
            referenceDate.setUTCMinutes(Number(referenceDate.getUTCMinutes()) + Number(displacement.m));
        }
        console.log('minutes ofset');
        console.log(this.getReadableTimeStamp(new Date(referenceDate)));
        if (displacement.h) {
            referenceDate.setUTCHours(Number(referenceDate.getUTCHours()) + Number(displacement.h));
        }
        console.log('hours ofset');
        console.log(this.getReadableTimeStamp(new Date(referenceDate)));
        if (displacement.d) {
            referenceDate.setUTCDate(Number(referenceDate.getUTCDate()) + Number(displacement.d));
        }
        return this
    }

    processSingleThread(text) {
        const match = this.threadRegex.exec(text)?.[1];
        const date = this.settings.dateOP
        if (!match) return text;
        //console.log(`Processing thread`);

        const board = this.processBoard(match)
        const topic = this.processTopic(match)
        const poster = this.processPoster(match)

        const OP = this.extractOP(match);
        const replies = this.processReplies(match)

        const n = replies.length; // total number of replies

        this.settings.posts ||= 10;

        const numberOfPages = Math.ceil(n / this.settings.posts) || 1;

        const thread = splitReplies.bind(this)(replies, this.settings.posts)
        //console.log(thread)
        let startpage = Number(this.settings.startpage) || 1;

        this.settings.endpage = !this.settings.endpage ? 0 : this.settings.endpage
        this.settings.addpages = !this.settings.addpages ? 0 : this.settings.addpages

        if (thread.short) {
            //console.log('will trunccate')
            this.settings.endpage = startpage + numberOfPages - 1
            this.settings.addpages = 0
        }


        let endPage = Math.max(1, this.settings.endpage, Number(startpage) + Number(numberOfPages) - 1 + Number(this.settings.addpages))


        let i = 0;
        let threadBBCode = ''
        const noop = /^\s*NOOP\s*$/m.test(match)
        if (!noop) {
            if (topic) {
                threadBBCode += `${topic}\n`
            }
            if (board) {
                threadBBCode += `${board}`
            }
            if (poster) {
                threadBBCode += this.extractPoster(poster)
                threadBBCode += "\nPosted " + this.getTime(date) + ':\n'

            }
            if (OP) {
                threadBBCode += mdToBBCode(OP)
            }
        }
        //console.log('this.settings')
        //  console.log(this.settings)
        for (const page of thread.pages) {
            if (page?.[0]?.page) {
                //  console.warn('page[0].page')
                //   console.warn(page[0].page)
                i = 0
                startpage = Number(page[0].page)
            }
            if (endPage < startpage + i) endPage = startpage + thread.pages.length
            threadBBCode += `\n\n[b](Showing page ${startpage + i} of ${endPage})[/b][indent]`
            console.log(page)
            for (const reply of page) {
                if (!reply) continue
                threadBBCode += "" + this.extractUser(reply.user, null, reply.date)
                threadBBCode += "\nReplied " + this.getTime(reply.date) + ':\n'
                threadBBCode += reply.text
            }


            threadBBCode += '[/indent]' + generatePagination(startpage + i, endPage)
            i++
        }
        threadBBCode += '\n[CENTER]■[/CENTER]'
        function splitByPage(arr) {
            let arrayHolder = []
            let i = 0
            arr.forEach(obj => {
                if (obj.page !== '') {
                    // If the "page" property is non-empty, start a new array

                    i++
                }
                // Add the current object to the current array
                if (!arrayHolder[i]) arrayHolder[i] = []
                arrayHolder[i].push(obj)
            });
            return arrayHolder
        }
        function splitReplies(replies, maxlen) {
            const result = {
                pages: [],
                short: false
            };
            // console.warn('imma split')


            if (replies.length > maxlen) {
                while (replies.length > maxlen) {
                    const chunk = replies.splice(0, maxlen);
                    result.pages.push(chunk)
                }

            }
            if (replies.length > 0) {
                if (replies.length < maxlen) result.short = true
                result.pages.push(replies)
            }

            return result;
        }

        function updatePages(pages, index, lastIndex) {
            if (lastIndex < index) {
                pages.push(index);
                lastIndex = index;
            }

            return lastIndex;
        }
        function generatePagination(currentPage, endPage) {
            let pagination = '\n[b]End of Page. ';
            let lastIndex = Math.min(5, endPage)

            let pages = Array.from({ length: lastIndex }, (_, index) => index + 1);

            if (currentPage - 1 > 5 + 1) {
                pages.push('...')
            }


            if (currentPage >= 5 && currentPage <= endPage - 3) {
                lastIndex = updatePages(pages, currentPage - 1, lastIndex)
                lastIndex = updatePages(pages, currentPage, lastIndex)


                if (endPage > currentPage) {
                    lastIndex = updatePages(pages, currentPage + 1, lastIndex)
                }
            }

            if (currentPage + 1 < endPage - 3) {
                pages.push('...')
            }

            if (endPage > 2) {
                lastIndex = updatePages(pages, endPage - 2, lastIndex)
            }
            if (endPage > 1) {
                lastIndex = updatePages(pages, endPage - 1, lastIndex)
            }
            lastIndex = updatePages(pages, endPage, lastIndex)
            //pages=Array.from(new Set(pages))

            const result = pages.reduce((acc, current, index) => {
                if (index > 0) {
                    if (current === '...') {
                        acc += ` ${current}`;
                    } else {
                        const formatted = current === currentPage ? current : `[u]${current}[/u]`
                        acc += (typeof current === 'number' && pages[index - 1] !== '...') ? `, ${formatted}` : ` ${formatted}`;
                    }
                } else {
                    const formatted = current === currentPage ? current : `[u]${current}[/u]`

                    acc += formatted;
                }
                return acc;
            }, '');

            pagination += result

            // Show the current page, its two neighbors, and the last three pages

            pagination += '[/b]';
            return pagination;
        }


        // function splitArray(array, maxlen) {
        //     const result = {
        //         arrays: [],
        //         short: false
        //     };

        //     for (let i = 0; i < array.length; i += maxlen) {
        //         const chunk = array.slice(i, i + maxlen);
        //         result.arrays.push(chunk);
        //         if (chunk.length < maxlen) {
        //             result.short = true;
        //         }
        //     }

        //     // function splitArray(array, maxlen) {
        //     //     const result = {
        //     //         arrays: [],
        //     //         short: false
        //     //     };

        //     //     for (let i = 0; i < array.length; i += maxlen) {
        //     //         const chunk = array.slice(i, i + maxlen);
        //     //         result.arrays.push(chunk);
        //     //     }

        //     //     // Check if the last chunk is shorter than maxlen
        //     //     if (result.arrays[result.arrays.length - 1].length < maxlen) {
        //     //         result.short = true;
        //     //     }

        //     //     return result;
        //     // }


        //     return result;
        // }

        return threadBBCode;


    }

    processScene(scene) {

        return scene.replace(this.allRegexes, this.combinedProcessor.bind(this));

    }

    processAllPHOScenes() {
        this.text = this.text.replace(/(?:^|[\n\r])PHO Interlude(.*?)[\n\r]EOPHO Interlude(?:$|[\n\r])/gs, (_, scene) => {
            // Process the captured content using your custom function
            const replacement = this.processScene(scene);
            // Return the replacement for the current line
            return `${replacement}`;
        });
        console.error('FINAL')
        console.log(JSON.stringify(this.users, null, 2))
        return this;
    }

    combinedProcessor(match) {
        //  console.log(this)
        return this.processSettings(match) ?? this.processUsers(match) ?? this.processWelcome(match) ?? this.processSingleThread(match) ?? match;
    }

    makeGreeting() {
        return `[CENTER]■[/CENTER]

[b]Welcome to the Parahumans Online message boards.[/b]
You are currently logged in, [u]${this.settings.reader}[/u]
You are viewing:
• Threads you have replied to
• AND Threads that have new replies
• OR private message conversations with new replies
• Thread OP is displayed.
• Ten posts per page
• Last ten messages in private message history.
• Threads and private messages are ordered chronologically.
[CENTER]■[/CENTER]
`
    }

    updateTime(datestring) {
        //console.warn(datestring)
        this.settings.date = new Date(datestring)
        this.settings.dateOP = new Date(datestring)
        return this
    }
    getReadableTimeStamp(date = this.settings.date) {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: "America/New_York",

            timeZoneName: 'longGeneric', // Include short time zone abbreviation
        };

        const formattedDate = date.toLocaleString('en-US', options);

        return `${formattedDate}`;
    }

    getTime(date = this.settings.date) {

        const options = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'America/New_York',
        };

        const formattedDate = date.toLocaleDateString('en-US', options);

        const suffix = getNumberSuffix(date.getDate());

        const result = `on [abbr="${this.getReadableTimeStamp(date)}"]${formattedDate.replace(/(?<=[A-Z][a-z]{2}\s+\d+\b)/, suffix)}[/abbr]`;

        //console.log(result);

        function getNumberSuffix(day) {
            if (day >= 11 && day <= 13) {
                return 'th';
            }
            const lastDigit = day % 10;
            switch (lastDigit) {
                case 1:
                    return 'st';
                case 2:
                    return 'nd';
                case 3:
                    return 'rd';
                default:
                    return 'th';
            }
        }

        return result;

    }

    extractSettings(string) {
        const arr = string.split('	')
        for (const entry of arr) {
            if (!entry) continue
            let [setting, ...value] = entry.split(":")
            if (!setting) continue
            value = value.join(":")
            if (setting === 'date') {
                this.updateTime(value);
                continue
            }
            this.settings[setting] = value
        }
        return this
    }

    extractUsers(text) {
        const lines = text.split('\n')
        for (const line of lines) {
            const conf = line.split('\t')
            if (!conf.length) continue
            const username = conf.shift()
            if (!username.length) continue

            this.users[username] = {};
            if (!conf.length) continue
            for (const param of conf) {
                const [key, value] = param.split(":")
                if (key === 'tag') {
                    this.users[username][key] = this.users[username][key] ? [...this.users[username][key], value] : [value]
                    continue;
                }
                this.users[username][key] = value
            }
        }
        return this

    }

    grep(regex, text, callback) {

        const string = regex.exec(text)?.[1];
        text = text.replace(regex, '')
        return callback(string)
    }

}

function mdToBBCode(text) {
    if (!text) return text
    return text
        //
        .replace(/\[(.+?)\]\((.+?)(\s".*")?\)/gmi, '[url=$2]$1[/url]') // url
        //
        .replace(/^(.+)(\n|\r\n)([=]{3,3}\s*(\n|\r\n)?)$/gmi, "[h1]$1[/h1]") // h1
        .replace(/^(.+)(\n|\r\n)([-]{3,3}\s*(\n|\r\n)?)$/gmi, "[h2]$1[/h2]") // h2
        //
        .replace(/~/gmi, '[u][size=1]$1[/size][/u]') // Custom Markdown syntax. Signature
        //
        .replace(/^[#]{6,6}\s*(.*[^\s])\s*[#]{6,6}\n?$/gmi, "[h6]$1[/h6]") // h4
        .replace(/^[#]{6,6}\s*(.*)\n?$/gmi, "[h6]$1[/h6]") // h4
        //
        .replace(/^>(.*)?[^\n]?$/gmi, "$1") // removes quotes
        //
        .replace(/^[#]{5,5}\s*(.*[^\s])\s*[#]{5,5}\n?$/gmi, "[h5]$1[/h5]") // h4
        .replace(/^[#]{5,5}\s*(.*)\n?$/gmi, "[h5]$1[/h5]") // h4
        //
        .replace(/^[#]{4,4}\s*(.*[^\s])\s*[#]{4,4}\n?$/gmi, "[h4]$1[/h4]") // h4
        .replace(/^[#]{4,4}\s*(.*)\n?$/gmi, "[h4]$1[/h4]") // h4
        //
        .replace(/^[#]{3,3}\s*(.*[^\s])\s*[#]{3,3}\n?$/gmi, "[h3]$1[/h3]") // h3
        .replace(/^[#]{3,3}\s?(.*)\n?$/gmi, "[h3]$1[/h3]") // h3
        //
        .replace(/^[ ]{20,20}([^\s].*)\n?$/gmi, "[indent=5]$1[/indent]") // instead of making indents code, make them indents
        .replace(/^[ ]{16,16}([^\s].*)\n?$/gmi, "[indent=4]$1[/indent]") // instead of making indents code, make them indents
        .replace(/^[ ]{12,12}([^\s].*)\n?$/gmi, "[indent=3]$1[/indent]") // instead of making indents code, make them indents
        .replace(/^[ ]{8,8}([^\s].*)\n?$/gmi, "[indent=2]$1[/indent]") // instead of making indents code, make them indents
        .replace(/^[ ]{4,4}([^\s].*)\n?$/gmi, "[indent]$1[/indent]") // instead of making indents code, make them indents
        //     ARROWS
        .replace(/=\>/gmi, "►")
        .replace(/\<=/gmi, "◄")
        .replace(/\<-\>/gmi, "↔")
        .replace(/\*\*\s*-\>\s*\*\*/gmi, "[size=6]→[/size]")
        .replace(/\*\*\s*\<-\s*\*\*/gmi, "[size=6]←[/size]")
        .replace(/-\>/gmi, "→")
        .replace(/\<-/gmi, "←")
        //
        .replace(/^\`{3,3}(.*)\n((?:.|\n)+?)\n\`{3,3}\n?$/gmi, "[code]$2[/code]")   // back ticks
        .replace(/^\~{3,3}(.*)\n((?:.|\n)+?)\n\~{3,3}\n?$/gmi, "[code]$2[/code]")   // tilde
        .replace(/\`([^\`].*?)\`/gmi, "[code single]$1[/code]")  // inline code
        //
        .replace(/\[!\[.*?\]\((.*?)\)\]\((.*?)\)/gmi, '[img]$1[/img]\nClickable image was pointing to [url=$2]here[/url]') //image
        .replace(/!\[(.*)\]\((.*)\)/gmi, '[img]$2[/img]') //image
        //
        .replace(/(?<!#)\*\*([^\*].*?\*?)\*\*/gmi, "[b]$1[/b]") // bold
        .replace(/(^|\s|indent(?:=\d)?\]|\[|<| )\*(?!\*+\s)(.*?[^\*].*?)\*(?<!\s\*)/gmi, "$1[i]$2[/i]")
        //  MDASH
        .replace(/(?<=[\w,!?'" ])--(?:[ \w,!?'"])/gmi, "—")
        .replace(/ - /gmi, "—")
    //.replace(/^>(.+)$/,"[quote]$1[/quote]")
}

function convert() {
    const left = document.getElementById("left_ta")?.value;
    const right = document.getElementById("right_ta");



    const isPHO = /^PHO Interlude/m.test(left)

    if (isPHO) {
        // console.log('Detected PHO')
        const interlude = new PHO(left)
        interlude.processAllPHOScenes()
        right.value = interlude.text

    } else {
        right.value = mdToBBCode(left)
    }

    console.log('converted');
}
