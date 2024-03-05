class PHO {
    constructor(text) {
        this.text = text

    }

    processAllPHOScenes(){
        this.text = mdToBBCode(this.text)
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
