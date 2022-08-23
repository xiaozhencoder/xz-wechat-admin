const EmojiArr = [
  ["[微笑]", "0"],
  ["[撇嘴]", "1"],
  ["[色]", "2"],
  ["[发呆]", "3"],
  ["[得意]", "4"],
  ["[流泪]", "5"],
  ["[害羞]", "6"],
  ["[闭嘴]", "7"],
  ["[睡]", "8"],
  ["[大哭]", "9"],
  ["[尴尬]", "10"],
  ["[发怒]", "11"],
  ["[调皮]", "12"],
  ["[呲牙]", "13"],
  ["[惊讶]", "14"],
  ["[难过]", "15"],
  ["[酷]", "16"],
  ["[囧]", "17"],
  ["[抓狂]", "18"],
  ["[吐]", "19"],
  ["[偷笑]", "20"],
  ["[愉快]", "21"],
  ["[白眼]", "22"],
  ["[傲慢]", "23"],
  ["[饥饿]", "24"],
  ["[困]", "25"],
  ["[惊恐]", "26"],
  ["[流汗]", "27"],
  ["[憨笑]", "28"],
  ["[悠闲]", "29"],
  ["[奋斗]", "30"],
  ["[咒骂]", "31"],
  ["[疑问]", "32"],
  ["[嘘]", "33"],
  ["[晕]", "34"],
  ["[疯了]", "35"],
  ["[衰]", "36"],
  ["[骷髅]", "37"],
  ["[敲打]", "38"],
  ["[再见]", "39"],
  ["[擦汗]", "40"],
  ["[抠鼻]", "41"],
  ["[鼓掌]", "42"],
  ["[糗大了]", "43"],
  ["[坏笑]", "44"],
  ["[左哼哼]", "45"],
  ["[右哼哼]", "46"],
  ["[哈欠]", "47"],
  ["[鄙视]", "48"],
  ["[委屈]", "49"],
  ["[快哭了]", "50"],
  ["[阴险]", "51"],
  ["[亲亲]", "52"],
  ["[吓]", "53"],
  ["[可怜]", "54"],
  ["[菜刀]", "55"],
  ["[西瓜]", "56"],
  ["[啤酒]", "57"],
  ["[篮球]", "58"],
  ["[乒乓]", "59"],
  ["[咖啡]", "60"],
  ["[饭]", "61"],
  ["[猪头]", "62"],
  ["[玫瑰]", "63"],
  ["[凋谢]", "64"],
  ["[嘴唇]", "65"],
  ["[爱心]", "66"],
  ["[心碎]", "67"],
  ["[蛋糕]", "68"],
  ["[闪电]", "69"],
  ["[炸弹]", "70"],
  ["[刀]", "71"],
  ["[足球]", "72"],
  ["[瓢虫]", "73"],
  ["[便便]", "74"],
  ["[月亮]", "75"],
  ["[太阳]", "76"],
  ["[礼物]", "77"],
  ["[拥抱]", "78"],
  ["[强]", "79"],
  ["[弱]", "80"],
  ["[握手]", "81"],
  ["[胜利]", "82"],
  ["[抱拳]", "83"],
  ["[勾引]", "84"],
  ["[拳头]", "85"],
  ["[差劲]", "86"],
  ["[爱你]", "87"],
  ["[NO]", "88"],
  ["[OK]", "89"],
  ["[爱情]", "90"],
  ["[飞吻]", "91"],
  ["[跳跳]", "92"],
  ["[发抖]", "93"],
  ["[怄火]", "94"],
  ["[转圈]", "95"],
  ["[磕头]", "96"],
  ["[回头]", "97"],
  ["[跳绳]", "98"],
  ["[投降]", "99"],
  ["[激动]", "100"],
  ["[乱舞]", "101"],
  ["[献吻]", "102"],
  ["[左太极]", "103"],
  ["[右太极]", "104"]
]

function getNickNameTemplate(obj) {
  return `<div class="edit-nick-name" contentEditable="false">
            <i>&zwnj;</i>
            <img class="nick-icon" src="/images/user-nick-name.png" alt=""/>
            <span class="nick-name">${obj.name || "客户昵称"}</span>
            <i>&zwnj;</i>
          </div>`
}

function getMinProgramTemplate(uniqueKey, obj, icon) {
  return `<div class="edit-applet ${uniqueKey}" contentEditable="false">
            <i>&zwnj;</i>
            <img class="applet-icon" src="/images/${"link-" + icon}.png" alt=""/>
            <span class="applet-name" style="${obj.name ? "color: #2749F1" : ""}" applet-name="${
    obj.name ? obj.name.split(".")[1] : ""
  }" applet-url="${obj.value || ""}" applet-id="${obj.appId || ""}">${
    obj.name ? obj.name.split(".")[1] : "小程序"
  }</span>
            <i>&zwnj;</i>
          </div>`
}

function getLinkTemplate(uniqueKey, obj, icon) {
  return `<div class="edit-link ${uniqueKey}" contentEditable="false">
            <i>&zwnj;</i>
            <img class="link-icon" src="/images/${"link-" + icon}.png" alt=""/>
            <span class="link-name" style="${obj.name ? "color: #2749F1" : ""}" link-name="${
    obj.name ? obj.name.split(".")[1] : ""
  }" link-url="${obj.value || ""}">${obj.name ? obj.name.split(".")[1] : "链接"}</span>
            <i>&zwnj;</i>
          </div>`
}

function getAttrTemplate(uniqueKey, obj, attrShowName, icon) {
  return `<div class="edit-attr" contentEditable="false">&zwnj;
            <div class="edit-attr__content">
                <img class="attr-icon" src="/images/${"add-quadrate-" + icon}.png" alt=""/>
                <span class="attr-name" style="${obj.value ? "color: #2749F1" : ""}" attr-name="${
    obj.value ? obj.value.split(".")[1] : ""
  }">${attrShowName || "用户属性"}</span>
            </div>
            <div class="edit-attr__default ${uniqueKey}">
                <img class="default-icon" src="/images/${"default-value-" + icon}.png" alt=""/>
                <span class="default-value" style="${obj.defaultValue ? "color: #2749F1" : ""}" default-value="${
    obj.defaultValue || ""
  }">${obj.defaultValue || ""}</span>
            </div>&zwnj;</div>`
}

function getEmojiTemplate(obj) {
  return `<div class="edit-emoji-img" contentEditable="false">
            <i>&zwnj;</i>
            <img class="emoji-icon" src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${obj[1]}.gif" alt="${obj[0]}"/>
            <i>&zwnj;</i>
          </div>`
}

export { EmojiArr, getNickNameTemplate, getMinProgramTemplate, getLinkTemplate, getAttrTemplate, getEmojiTemplate }
