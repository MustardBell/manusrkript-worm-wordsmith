function convert()
    {
    var left = document.getElementById("left_ta");
    var right = document.getElementById("right_ta");
    
    var left_value = left.value;
        //general Markdown conversion
        left_value = left_value
        //
        .replace(/\[(.+?)\]\((.+?)(\s".*")?\)/gmi,'[url=$2]$1[/url]') // url
        //
        .replace(/^(.+)(\n|\r\n)([=]{3,3}\s*(\n|\r\n)?)$/gmi, "[h1]$1[/h1]") // h1
        .replace(/^(.+)(\n|\r\n)([-]{3,3}\s*(\n|\r\n)?)$/gmi, "[h2]$1[/h2]") // h2
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
        //.replace(/^[#]{2,2}\s*(.*[^\s])\s*[#]{2,2}\n?$/gmi, "[h2]$1[/h2]") // h2
        //.replace(/^[#]{2,2}\s*(.*)\n?$/gmi, "[h2]$1[/h2]") // h2
        //
        //.replace(/^[#]{1,1}\s*(.*[^\s])\s*[#]{1,1}\n?$/gmi, "[h1]$1[/h1]") // h1
        //.replace(/^(?!\n*[`]{3,3})[#]{1,1}\s*(.*)\n?$/gmi, "[h1]$1[/h1]") // h1
        //
        //.replace(/^\t|[ ]{4,4}(.*)/gmi, "$1")  //code; strips tabs
        .replace(/^\`{3,3}(.*)\n((?:.|\n)+?)\n\`{3,3}\n?$/gmi, "[code]$2[/code]")   // back ticks
        .replace(/^\~{3,3}(.*)\n((?:.|\n)+?)\n\~{3,3}\n?$/gmi, "[code]$2[/code]")   // tilde
        .replace(/\`([^\`].*?)\`/gmi, "[code single]$1[/code]")  // inline code
        //
        .replace(/\[!\[.*?\]\((.*?)\)\]\((.*?)\)/gmi,'[img]$1[/img]\nClickable image was pointing to [url=$2]here[/url]') //image
        .replace(/!\[(.*)\]\((.*)\)/gmi,'[img]$2[/img]') //image
        //
        .replace(/\*\*\*([^\*].*?)\*\*\*/gmi, "[b][i]$1[/i][/b]") // bold + itlaic
        .replace(/\*\*([^\*].*?)\*\*/gmi, "[b]$1[/b]") // bold
        .replace(/(\s)\*((?!\/[0-9]|\s|\*).*?)\*(\s)/gmi, "$1[i]$2[/i]$3")  // italic
        //
        right.value = left_value;
        console.log('converted');
    }
    