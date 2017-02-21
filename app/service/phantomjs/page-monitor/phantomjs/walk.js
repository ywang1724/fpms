module.exports = function(TOKEN, data){

    /*
     * JavaScript MD5 1.0.1
     * https://github.com/blueimp/JavaScript-MD5
     *
     * Copyright 2011, Sebastian Tschan
     * https://blueimp.net
     *
     * Licensed under the MIT license:
     * http://www.opensource.org/licenses/MIT
     *
     * Based on
     * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
     * Digest Algorithm, as defined in RFC 1321.
     * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * Distributed under the BSD License
     * See http://pajhome.org.uk/crypt/md5 for more info.
     */

    var md5 = function(){"use strict";function n(n,r){var t=(65535&n)+(65535&r),u=(n>>16)+(r>>16)+(t>>16);return u<<16|65535&t}function r(n,r){return n<<r|n>>>32-r}function t(t,u,e,o,c,f){return n(r(n(n(u,t),n(o,f)),c),e)}function u(n,r,u,e,o,c,f){return t(r&u|~r&e,n,r,o,c,f)}function e(n,r,u,e,o,c,f){return t(r&e|u&~e,n,r,o,c,f)}function o(n,r,u,e,o,c,f){return t(r^u^e,n,r,o,c,f)}function c(n,r,u,e,o,c,f){return t(u^(r|~e),n,r,o,c,f)}function f(r,t){r[t>>5]|=128<<t%32,r[(t+64>>>9<<4)+14]=t;var f,i,a,h,g,l=1732584193,v=-271733879,d=-1732584194,C=271733878;for(f=0;f<r.length;f+=16)i=l,a=v,h=d,g=C,l=u(l,v,d,C,r[f],7,-680876936),C=u(C,l,v,d,r[f+1],12,-389564586),d=u(d,C,l,v,r[f+2],17,606105819),v=u(v,d,C,l,r[f+3],22,-1044525330),l=u(l,v,d,C,r[f+4],7,-176418897),C=u(C,l,v,d,r[f+5],12,1200080426),d=u(d,C,l,v,r[f+6],17,-1473231341),v=u(v,d,C,l,r[f+7],22,-45705983),l=u(l,v,d,C,r[f+8],7,1770035416),C=u(C,l,v,d,r[f+9],12,-1958414417),d=u(d,C,l,v,r[f+10],17,-42063),v=u(v,d,C,l,r[f+11],22,-1990404162),l=u(l,v,d,C,r[f+12],7,1804603682),C=u(C,l,v,d,r[f+13],12,-40341101),d=u(d,C,l,v,r[f+14],17,-1502002290),v=u(v,d,C,l,r[f+15],22,1236535329),l=e(l,v,d,C,r[f+1],5,-165796510),C=e(C,l,v,d,r[f+6],9,-1069501632),d=e(d,C,l,v,r[f+11],14,643717713),v=e(v,d,C,l,r[f],20,-373897302),l=e(l,v,d,C,r[f+5],5,-701558691),C=e(C,l,v,d,r[f+10],9,38016083),d=e(d,C,l,v,r[f+15],14,-660478335),v=e(v,d,C,l,r[f+4],20,-405537848),l=e(l,v,d,C,r[f+9],5,568446438),C=e(C,l,v,d,r[f+14],9,-1019803690),d=e(d,C,l,v,r[f+3],14,-187363961),v=e(v,d,C,l,r[f+8],20,1163531501),l=e(l,v,d,C,r[f+13],5,-1444681467),C=e(C,l,v,d,r[f+2],9,-51403784),d=e(d,C,l,v,r[f+7],14,1735328473),v=e(v,d,C,l,r[f+12],20,-1926607734),l=o(l,v,d,C,r[f+5],4,-378558),C=o(C,l,v,d,r[f+8],11,-2022574463),d=o(d,C,l,v,r[f+11],16,1839030562),v=o(v,d,C,l,r[f+14],23,-35309556),l=o(l,v,d,C,r[f+1],4,-1530992060),C=o(C,l,v,d,r[f+4],11,1272893353),d=o(d,C,l,v,r[f+7],16,-155497632),v=o(v,d,C,l,r[f+10],23,-1094730640),l=o(l,v,d,C,r[f+13],4,681279174),C=o(C,l,v,d,r[f],11,-358537222),d=o(d,C,l,v,r[f+3],16,-722521979),v=o(v,d,C,l,r[f+6],23,76029189),l=o(l,v,d,C,r[f+9],4,-640364487),C=o(C,l,v,d,r[f+12],11,-421815835),d=o(d,C,l,v,r[f+15],16,530742520),v=o(v,d,C,l,r[f+2],23,-995338651),l=c(l,v,d,C,r[f],6,-198630844),C=c(C,l,v,d,r[f+7],10,1126891415),d=c(d,C,l,v,r[f+14],15,-1416354905),v=c(v,d,C,l,r[f+5],21,-57434055),l=c(l,v,d,C,r[f+12],6,1700485571),C=c(C,l,v,d,r[f+3],10,-1894986606),d=c(d,C,l,v,r[f+10],15,-1051523),v=c(v,d,C,l,r[f+1],21,-2054922799),l=c(l,v,d,C,r[f+8],6,1873313359),C=c(C,l,v,d,r[f+15],10,-30611744),d=c(d,C,l,v,r[f+6],15,-1560198380),v=c(v,d,C,l,r[f+13],21,1309151649),l=c(l,v,d,C,r[f+4],6,-145523070),C=c(C,l,v,d,r[f+11],10,-1120210379),d=c(d,C,l,v,r[f+2],15,718787259),v=c(v,d,C,l,r[f+9],21,-343485551),l=n(l,i),v=n(v,a),d=n(d,h),C=n(C,g);return[l,v,d,C]}function i(n){var r,t="";for(r=0;r<32*n.length;r+=8)t+=String.fromCharCode(n[r>>5]>>>r%32&255);return t}function a(n){var r,t=[];for(t[(n.length>>2)-1]=void 0,r=0;r<t.length;r+=1)t[r]=0;for(r=0;r<8*n.length;r+=8)t[r>>5]|=(255&n.charCodeAt(r/8))<<r%32;return t}function h(n){return i(f(a(n),8*n.length))}function g(n,r){var t,u,e=a(n),o=[],c=[];for(o[15]=c[15]=void 0,e.length>16&&(e=f(e,8*n.length)),t=0;16>t;t+=1)o[t]=909522486^e[t],c[t]=1549556828^e[t];return u=f(o.concat(a(r)),512+8*r.length),i(f(c.concat(u),640))}function l(n){var r,t,u="0123456789abcdef",e="";for(t=0;t<n.length;t+=1)r=n.charCodeAt(t),e+=u.charAt(r>>>4&15)+u.charAt(15&r);return e}function v(n){return unescape(encodeURIComponent(n))}function d(n){return h(v(n))}function C(n){return l(d(n))}function A(n,r){return g(v(n),v(r))}function m(n,r){return l(A(n,r))}function s(n,r,t){return r?t?A(r,n):m(r,n):t?d(n):C(n)}return s}();

    /*! Sizzle v2.3.4-pre | (c) JS Foundation and other contributors | js.foundation */
    (function(window){var i,support,Expr,getText,isXML,tokenize,compile,select,outermostContext,sortInput,hasDuplicate,setDocument,document,docElem,documentIsHTML,rbuggyQSA,rbuggyMatches,matches,contains,expando="sizzle"+1*new Date,preferredDoc=window.document,dirruns=0,done=0,classCache=createCache(),tokenCache=createCache(),compilerCache=createCache(),nonnativeSelectorCache=createCache(),sortOrder=function(a,b){if(a===b){hasDuplicate=true}return 0},hasOwn={}.hasOwnProperty,arr=[],pop=arr.pop,push_native=arr.push,push=arr.push,slice=arr.slice,indexOf=function(list,elem){var i=0,len=list.length;for(;i<len;i++){if(list[i]===elem){return i}}return-1},booleans="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",whitespace="[\\x20\\t\\r\\n\\f]",identifier="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",attributes="\\["+whitespace+"*("+identifier+")(?:"+whitespace+"*([*^$|!~]?=)"+whitespace+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+identifier+"))|)"+whitespace+"*\\]",pseudos=":("+identifier+")(?:\\(("+"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|"+"((?:\\\\.|[^\\\\()[\\]]|"+attributes+")*)|"+".*"+")\\)|)",rwhitespace=new RegExp(whitespace+"+","g"),rtrim=new RegExp("^"+whitespace+"+|((?:^|[^\\\\])(?:\\\\.)*)"+whitespace+"+$","g"),rcomma=new RegExp("^"+whitespace+"*,"+whitespace+"*"),rcombinators=new RegExp("^"+whitespace+"*([>+~]|"+whitespace+")"+whitespace+"*"),rattributeQuotes=new RegExp("="+whitespace+"*([^\\]'\"]*?)"+whitespace+"*\\]","g"),rpseudo=new RegExp(pseudos),ridentifier=new RegExp("^"+identifier+"$"),matchExpr={ID:new RegExp("^#("+identifier+")"),CLASS:new RegExp("^\\.("+identifier+")"),TAG:new RegExp("^("+identifier+"|[*])"),ATTR:new RegExp("^"+attributes),PSEUDO:new RegExp("^"+pseudos),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+whitespace+"*(even|odd|(([+-]|)(\\d*)n|)"+whitespace+"*(?:([+-]|)"+whitespace+"*(\\d+)|))"+whitespace+"*\\)|)","i"),bool:new RegExp("^(?:"+booleans+")$","i"),needsContext:new RegExp("^"+whitespace+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+whitespace+"*((?:-\\d)?\\d*)"+whitespace+"*\\)|)(?=[^-]|$)","i")},rinputs=/^(?:input|select|textarea|button)$/i,rheader=/^h\d$/i,rnative=/^[^{]+\{\s*\[native \w/,rquickExpr=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,rsibling=/[+~]/,runescape=new RegExp("\\\\([\\da-f]{1,6}"+whitespace+"?|("+whitespace+")|.)","ig"),funescape=function(_,escaped,escapedWhitespace){var high="0x"+escaped-65536;return high!==high||escapedWhitespace?escaped:high<0?String.fromCharCode(high+65536):String.fromCharCode(high>>10|55296,high&1023|56320)},rcssescape=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,fcssescape=function(ch,asCodePoint){if(asCodePoint){if(ch==="\0"){return"�"}return ch.slice(0,-1)+"\\"+ch.charCodeAt(ch.length-1).toString(16)+" "}return"\\"+ch},unloadHandler=function(){setDocument()},inDisabledFieldset=addCombinator(function(elem){return elem.disabled===true&&elem.nodeName.toLowerCase()==="fieldset"},{dir:"parentNode",next:"legend"});try{push.apply(arr=slice.call(preferredDoc.childNodes),preferredDoc.childNodes);arr[preferredDoc.childNodes.length].nodeType}catch(e){push={apply:arr.length?function(target,els){push_native.apply(target,slice.call(els))}:function(target,els){var j=target.length,i=0;while(target[j++]=els[i++]){}target.length=j-1}}}function Sizzle(selector,context,results,seed){var m,i,elem,nid,match,groups,newSelector,newContext=context&&context.ownerDocument,nodeType=context?context.nodeType:9;results=results||[];if(typeof selector!=="string"||!selector||nodeType!==1&&nodeType!==9&&nodeType!==11){return results}if(!seed){if((context?context.ownerDocument||context:preferredDoc)!==document){setDocument(context)}context=context||document;if(documentIsHTML){if(nodeType!==11&&(match=rquickExpr.exec(selector))){if(m=match[1]){if(nodeType===9){if(elem=context.getElementById(m)){if(elem.id===m){results.push(elem);return results}}else{return results}}else{if(newContext&&(elem=newContext.getElementById(m))&&contains(context,elem)&&elem.id===m){results.push(elem);return results}}}else if(match[2]){push.apply(results,context.getElementsByTagName(selector));return results}else if((m=match[3])&&support.getElementsByClassName&&context.getElementsByClassName){push.apply(results,context.getElementsByClassName(m));return results}}if(support.qsa&&!nonnativeSelectorCache[selector+" "]&&(!rbuggyQSA||!rbuggyQSA.test(selector))){if(nodeType!==1){newContext=context;newSelector=selector}else if(context.nodeName.toLowerCase()!=="object"){if(nid=context.getAttribute("id")){nid=nid.replace(rcssescape,fcssescape)}else{context.setAttribute("id",nid=expando)}groups=tokenize(selector);i=groups.length;while(i--){groups[i]="#"+nid+" "+toSelector(groups[i])}newSelector=groups.join(",");newContext=rsibling.test(selector)&&testContext(context.parentNode)||context}if(newSelector){try{push.apply(results,newContext.querySelectorAll(newSelector));return results}catch(qsaError){nonnativeSelectorCache(selector)}finally{if(nid===expando){context.removeAttribute("id")}}}}}}return select(selector.replace(rtrim,"$1"),context,results,seed)}function createCache(){var keys=[];function cache(key,value){if(keys.push(key+" ")>Expr.cacheLength){delete cache[keys.shift()]}return cache[key+" "]=value}return cache}function markFunction(fn){fn[expando]=true;return fn}function assert(fn){var el=document.createElement("fieldset");try{return!!fn(el)}catch(e){return false}finally{if(el.parentNode){el.parentNode.removeChild(el)}el=null}}function addHandle(attrs,handler){var arr=attrs.split("|"),i=arr.length;while(i--){Expr.attrHandle[arr[i]]=handler}}function siblingCheck(a,b){var cur=b&&a,diff=cur&&a.nodeType===1&&b.nodeType===1&&a.sourceIndex-b.sourceIndex;if(diff){return diff}if(cur){while(cur=cur.nextSibling){if(cur===b){return-1}}}return a?1:-1}function createInputPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type===type}}function createButtonPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return(name==="input"||name==="button")&&elem.type===type}}function createDisabledPseudo(disabled){return function(elem){if("form"in elem){if(elem.parentNode&&elem.disabled===false){if("label"in elem){if("label"in elem.parentNode){return elem.parentNode.disabled===disabled}else{return elem.disabled===disabled}}return elem.isDisabled===disabled||elem.isDisabled!==!disabled&&inDisabledFieldset(elem)===disabled}return elem.disabled===disabled}else if("label"in elem){return elem.disabled===disabled}return false}}function createPositionalPseudo(fn){return markFunction(function(argument){argument=+argument;return markFunction(function(seed,matches){var j,matchIndexes=fn([],seed.length,argument),i=matchIndexes.length;while(i--){if(seed[j=matchIndexes[i]]){seed[j]=!(matches[j]=seed[j])}}})})}function testContext(context){return context&&typeof context.getElementsByTagName!=="undefined"&&context}support=Sizzle.support={};isXML=Sizzle.isXML=function(elem){var documentElement=elem&&(elem.ownerDocument||elem).documentElement;return documentElement?documentElement.nodeName!=="HTML":false};setDocument=Sizzle.setDocument=function(node){var hasCompare,subWindow,doc=node?node.ownerDocument||node:preferredDoc;if(doc===document||doc.nodeType!==9||!doc.documentElement){return document}document=doc;docElem=document.documentElement;documentIsHTML=!isXML(document);if(preferredDoc!==document&&(subWindow=document.defaultView)&&subWindow.top!==subWindow){if(subWindow.addEventListener){subWindow.addEventListener("unload",unloadHandler,false)}else if(subWindow.attachEvent){subWindow.attachEvent("onunload",unloadHandler)}}support.attributes=assert(function(el){el.className="i";return!el.getAttribute("className")});support.getElementsByTagName=assert(function(el){el.appendChild(document.createComment(""));return!el.getElementsByTagName("*").length});support.getElementsByClassName=rnative.test(document.getElementsByClassName);support.getById=assert(function(el){docElem.appendChild(el).id=expando;return!document.getElementsByName||!document.getElementsByName(expando).length});if(support.getById){Expr.filter["ID"]=function(id){var attrId=id.replace(runescape,funescape);return function(elem){return elem.getAttribute("id")===attrId}};Expr.find["ID"]=function(id,context){if(typeof context.getElementById!=="undefined"&&documentIsHTML){var elem=context.getElementById(id);return elem?[elem]:[]}}}else{Expr.filter["ID"]=function(id){var attrId=id.replace(runescape,funescape);return function(elem){var node=typeof elem.getAttributeNode!=="undefined"&&elem.getAttributeNode("id");return node&&node.value===attrId}};Expr.find["ID"]=function(id,context){if(typeof context.getElementById!=="undefined"&&documentIsHTML){var node,i,elems,elem=context.getElementById(id);if(elem){node=elem.getAttributeNode("id");if(node&&node.value===id){return[elem]}elems=context.getElementsByName(id);i=0;while(elem=elems[i++]){node=elem.getAttributeNode("id");if(node&&node.value===id){return[elem]}}}return[]}}}Expr.find["TAG"]=support.getElementsByTagName?function(tag,context){if(typeof context.getElementsByTagName!=="undefined"){return context.getElementsByTagName(tag)}else if(support.qsa){return context.querySelectorAll(tag)}}:function(tag,context){var elem,tmp=[],i=0,results=context.getElementsByTagName(tag);if(tag==="*"){while(elem=results[i++]){if(elem.nodeType===1){tmp.push(elem)}}return tmp}return results};Expr.find["CLASS"]=support.getElementsByClassName&&function(className,context){if(typeof context.getElementsByClassName!=="undefined"&&documentIsHTML){return context.getElementsByClassName(className)}};rbuggyMatches=[];rbuggyQSA=[];if(support.qsa=rnative.test(document.querySelectorAll)){assert(function(el){docElem.appendChild(el).innerHTML="<a id='"+expando+"'></a>"+"<select id='"+expando+"-\r\\' msallowcapture=''>"+"<option selected=''></option></select>";if(el.querySelectorAll("[msallowcapture^='']").length){rbuggyQSA.push("[*^$]="+whitespace+"*(?:''|\"\")")}if(!el.querySelectorAll("[selected]").length){rbuggyQSA.push("\\["+whitespace+"*(?:value|"+booleans+")")}if(!el.querySelectorAll("[id~="+expando+"-]").length){rbuggyQSA.push("~=")}if(!el.querySelectorAll(":checked").length){rbuggyQSA.push(":checked")}if(!el.querySelectorAll("a#"+expando+"+*").length){rbuggyQSA.push(".#.+[+~]")}});assert(function(el){el.innerHTML="<a href='' disabled='disabled'></a>"+"<select disabled='disabled'><option/></select>";var input=document.createElement("input");input.setAttribute("type","hidden");el.appendChild(input).setAttribute("name","D");if(el.querySelectorAll("[name=d]").length){rbuggyQSA.push("name"+whitespace+"*[*^$|!~]?=")}if(el.querySelectorAll(":enabled").length!==2){rbuggyQSA.push(":enabled",":disabled")}docElem.appendChild(el).disabled=true;if(el.querySelectorAll(":disabled").length!==2){rbuggyQSA.push(":enabled",":disabled")}el.querySelectorAll("*,:x");rbuggyQSA.push(",.*:")})}if(support.matchesSelector=rnative.test(matches=docElem.matches||docElem.webkitMatchesSelector||docElem.mozMatchesSelector||docElem.oMatchesSelector||docElem.msMatchesSelector)){assert(function(el){support.disconnectedMatch=matches.call(el,"*");matches.call(el,"[s!='']:x");rbuggyMatches.push("!=",pseudos)})}rbuggyQSA=rbuggyQSA.length&&new RegExp(rbuggyQSA.join("|"));rbuggyMatches=rbuggyMatches.length&&new RegExp(rbuggyMatches.join("|"));hasCompare=rnative.test(docElem.compareDocumentPosition);contains=hasCompare||rnative.test(docElem.contains)?function(a,b){var adown=a.nodeType===9?a.documentElement:a,bup=b&&b.parentNode;return a===bup||!!(bup&&bup.nodeType===1&&(adown.contains?adown.contains(bup):a.compareDocumentPosition&&a.compareDocumentPosition(bup)&16))}:function(a,b){if(b){while(b=b.parentNode){if(b===a){return true}}}return false};sortOrder=hasCompare?function(a,b){if(a===b){hasDuplicate=true;return 0}var compare=!a.compareDocumentPosition-!b.compareDocumentPosition;if(compare){return compare}compare=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1;if(compare&1||!support.sortDetached&&b.compareDocumentPosition(a)===compare){if(a===document||a.ownerDocument===preferredDoc&&contains(preferredDoc,a)){return-1}if(b===document||b.ownerDocument===preferredDoc&&contains(preferredDoc,b)){return 1}return sortInput?indexOf(sortInput,a)-indexOf(sortInput,b):0}return compare&4?-1:1}:function(a,b){if(a===b){hasDuplicate=true;return 0}var cur,i=0,aup=a.parentNode,bup=b.parentNode,ap=[a],bp=[b];if(!aup||!bup){return a===document?-1:b===document?1:aup?-1:bup?1:sortInput?indexOf(sortInput,a)-indexOf(sortInput,b):0}else if(aup===bup){return siblingCheck(a,b)}cur=a;while(cur=cur.parentNode){ap.unshift(cur)}cur=b;while(cur=cur.parentNode){bp.unshift(cur)}while(ap[i]===bp[i]){i++}return i?siblingCheck(ap[i],bp[i]):ap[i]===preferredDoc?-1:bp[i]===preferredDoc?1:0};return document};Sizzle.matches=function(expr,elements){return Sizzle(expr,null,null,elements)};Sizzle.matchesSelector=function(elem,expr){if((elem.ownerDocument||elem)!==document){setDocument(elem)}expr=expr.replace(rattributeQuotes,"='$1']");if(support.matchesSelector&&documentIsHTML&&!nonnativeSelectorCache[expr+" "]&&(!rbuggyMatches||!rbuggyMatches.test(expr))&&(!rbuggyQSA||!rbuggyQSA.test(expr))){try{var ret=matches.call(elem,expr);if(ret||support.disconnectedMatch||elem.document&&elem.document.nodeType!==11){return ret}}catch(e){nonnativeSelectorCache(expr)}}return Sizzle(expr,document,null,[elem]).length>0};Sizzle.contains=function(context,elem){if((context.ownerDocument||context)!==document){setDocument(context)}return contains(context,elem)};Sizzle.attr=function(elem,name){if((elem.ownerDocument||elem)!==document){setDocument(elem)}var fn=Expr.attrHandle[name.toLowerCase()],val=fn&&hasOwn.call(Expr.attrHandle,name.toLowerCase())?fn(elem,name,!documentIsHTML):undefined;return val!==undefined?val:support.attributes||!documentIsHTML?elem.getAttribute(name):(val=elem.getAttributeNode(name))&&val.specified?val.value:null};Sizzle.escape=function(sel){return(sel+"").replace(rcssescape,fcssescape)};Sizzle.error=function(msg){throw new Error("Syntax error, unrecognized expression: "+msg)};Sizzle.uniqueSort=function(results){var elem,duplicates=[],j=0,i=0;hasDuplicate=!support.detectDuplicates;sortInput=!support.sortStable&&results.slice(0);results.sort(sortOrder);if(hasDuplicate){while(elem=results[i++]){if(elem===results[i]){j=duplicates.push(i)}}while(j--){results.splice(duplicates[j],1)}}sortInput=null;return results};getText=Sizzle.getText=function(elem){var node,ret="",i=0,nodeType=elem.nodeType;if(!nodeType){while(node=elem[i++]){ret+=getText(node)}}else if(nodeType===1||nodeType===9||nodeType===11){if(typeof elem.textContent==="string"){return elem.textContent}else{for(elem=elem.firstChild;elem;elem=elem.nextSibling){ret+=getText(elem)}}}else if(nodeType===3||nodeType===4){return elem.nodeValue}return ret};Expr=Sizzle.selectors={cacheLength:50,createPseudo:markFunction,match:matchExpr,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:true}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:true},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(match){match[1]=match[1].replace(runescape,funescape);match[3]=(match[3]||match[4]||match[5]||"").replace(runescape,funescape);if(match[2]==="~="){match[3]=" "+match[3]+" "}return match.slice(0,4)},CHILD:function(match){match[1]=match[1].toLowerCase();if(match[1].slice(0,3)==="nth"){if(!match[3]){Sizzle.error(match[0])}match[4]=+(match[4]?match[5]+(match[6]||1):2*(match[3]==="even"||match[3]==="odd"));match[5]=+(match[7]+match[8]||match[3]==="odd")}else if(match[3]){Sizzle.error(match[0])}return match},PSEUDO:function(match){var excess,unquoted=!match[6]&&match[2];if(matchExpr["CHILD"].test(match[0])){return null}if(match[3]){match[2]=match[4]||match[5]||""}else if(unquoted&&rpseudo.test(unquoted)&&(excess=tokenize(unquoted,true))&&(excess=unquoted.indexOf(")",unquoted.length-excess)-unquoted.length)){match[0]=match[0].slice(0,excess);match[2]=unquoted.slice(0,excess)}return match.slice(0,3)}},filter:{TAG:function(nodeNameSelector){var nodeName=nodeNameSelector.replace(runescape,funescape).toLowerCase();return nodeNameSelector==="*"?function(){return true}:function(elem){return elem.nodeName&&elem.nodeName.toLowerCase()===nodeName}},CLASS:function(className){var pattern=classCache[className+" "];return pattern||(pattern=new RegExp("(^|"+whitespace+")"+className+"("+whitespace+"|$)"))&&classCache(className,function(elem){return pattern.test(typeof elem.className==="string"&&elem.className||typeof elem.getAttribute!=="undefined"&&elem.getAttribute("class")||"")})},ATTR:function(name,operator,check){return function(elem){var result=Sizzle.attr(elem,name);if(result==null){return operator==="!="}if(!operator){return true}result+="";return operator==="="?result===check:operator==="!="?result!==check:operator==="^="?check&&result.indexOf(check)===0:operator==="*="?check&&result.indexOf(check)>-1:operator==="$="?check&&result.slice(-check.length)===check:operator==="~="?(" "+result.replace(rwhitespace," ")+" ").indexOf(check)>-1:operator==="|="?result===check||result.slice(0,check.length+1)===check+"-":false}},CHILD:function(type,what,argument,first,last){var simple=type.slice(0,3)!=="nth",forward=type.slice(-4)!=="last",ofType=what==="of-type";return first===1&&last===0?function(elem){return!!elem.parentNode}:function(elem,context,xml){var cache,uniqueCache,outerCache,node,nodeIndex,start,dir=simple!==forward?"nextSibling":"previousSibling",parent=elem.parentNode,name=ofType&&elem.nodeName.toLowerCase(),useCache=!xml&&!ofType,diff=false;if(parent){if(simple){while(dir){node=elem;while(node=node[dir]){if(ofType?node.nodeName.toLowerCase()===name:node.nodeType===1){return false}}start=dir=type==="only"&&!start&&"nextSibling"}return true}start=[forward?parent.firstChild:parent.lastChild];if(forward&&useCache){node=parent;outerCache=node[expando]||(node[expando]={});uniqueCache=outerCache[node.uniqueID]||(outerCache[node.uniqueID]={});cache=uniqueCache[type]||[];nodeIndex=cache[0]===dirruns&&cache[1];diff=nodeIndex&&cache[2];node=nodeIndex&&parent.childNodes[nodeIndex];while(node=++nodeIndex&&node&&node[dir]||(diff=nodeIndex=0)||start.pop()){if(node.nodeType===1&&++diff&&node===elem){uniqueCache[type]=[dirruns,nodeIndex,diff];break}}}else{if(useCache){node=elem;outerCache=node[expando]||(node[expando]={});uniqueCache=outerCache[node.uniqueID]||(outerCache[node.uniqueID]={});cache=uniqueCache[type]||[];nodeIndex=cache[0]===dirruns&&cache[1];diff=nodeIndex}if(diff===false){while(node=++nodeIndex&&node&&node[dir]||(diff=nodeIndex=0)||start.pop()){if((ofType?node.nodeName.toLowerCase()===name:node.nodeType===1)&&++diff){if(useCache){outerCache=node[expando]||(node[expando]={});uniqueCache=outerCache[node.uniqueID]||(outerCache[node.uniqueID]={});uniqueCache[type]=[dirruns,diff]}if(node===elem){break}}}}}diff-=last;return diff===first||diff%first===0&&diff/first>=0}}},PSEUDO:function(pseudo,argument){var args,fn=Expr.pseudos[pseudo]||Expr.setFilters[pseudo.toLowerCase()]||Sizzle.error("unsupported pseudo: "+pseudo);if(fn[expando]){return fn(argument)}if(fn.length>1){args=[pseudo,pseudo,"",argument];return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase())?markFunction(function(seed,matches){var idx,matched=fn(seed,argument),i=matched.length;while(i--){idx=indexOf(seed,matched[i]);seed[idx]=!(matches[idx]=matched[i])}}):function(elem){return fn(elem,0,args)}}return fn}},pseudos:{not:markFunction(function(selector){var input=[],results=[],matcher=compile(selector.replace(rtrim,"$1"));return matcher[expando]?markFunction(function(seed,matches,context,xml){var elem,unmatched=matcher(seed,null,xml,[]),i=seed.length;while(i--){if(elem=unmatched[i]){seed[i]=!(matches[i]=elem)}}}):function(elem,context,xml){input[0]=elem;matcher(input,null,xml,results);input[0]=null;return!results.pop()}}),has:markFunction(function(selector){return function(elem){return Sizzle(selector,elem).length>0}}),contains:markFunction(function(text){text=text.replace(runescape,funescape);return function(elem){return(elem.textContent||elem.innerText||getText(elem)).indexOf(text)>-1}}),lang:markFunction(function(lang){if(!ridentifier.test(lang||"")){Sizzle.error("unsupported lang: "+lang)}lang=lang.replace(runescape,funescape).toLowerCase();return function(elem){var elemLang;do{if(elemLang=documentIsHTML?elem.lang:elem.getAttribute("xml:lang")||elem.getAttribute("lang")){elemLang=elemLang.toLowerCase();return elemLang===lang||elemLang.indexOf(lang+"-")===0}}while((elem=elem.parentNode)&&elem.nodeType===1);return false}}),target:function(elem){var hash=window.location&&window.location.hash;return hash&&hash.slice(1)===elem.id},root:function(elem){return elem===docElem},focus:function(elem){return elem===document.activeElement&&(!document.hasFocus||document.hasFocus())&&!!(elem.type||elem.href||~elem.tabIndex)},enabled:createDisabledPseudo(false),disabled:createDisabledPseudo(true),checked:function(elem){var nodeName=elem.nodeName.toLowerCase();return nodeName==="input"&&!!elem.checked||nodeName==="option"&&!!elem.selected},selected:function(elem){if(elem.parentNode){elem.parentNode.selectedIndex}return elem.selected===true},empty:function(elem){for(elem=elem.firstChild;elem;elem=elem.nextSibling){if(elem.nodeType<6){return false}}return true},parent:function(elem){return!Expr.pseudos["empty"](elem)},header:function(elem){return rheader.test(elem.nodeName)},input:function(elem){return rinputs.test(elem.nodeName)},button:function(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type==="button"||name==="button"},text:function(elem){var attr;return elem.nodeName.toLowerCase()==="input"&&elem.type==="text"&&((attr=elem.getAttribute("type"))==null||attr.toLowerCase()==="text")},first:createPositionalPseudo(function(){return[0]}),last:createPositionalPseudo(function(matchIndexes,length){return[length-1]}),eq:createPositionalPseudo(function(matchIndexes,length,argument){return[argument<0?argument+length:argument]}),even:createPositionalPseudo(function(matchIndexes,length){var i=0;for(;i<length;i+=2){matchIndexes.push(i)}return matchIndexes}),odd:createPositionalPseudo(function(matchIndexes,length){var i=1;for(;i<length;i+=2){matchIndexes.push(i)}return matchIndexes}),lt:createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;--i>=0;){matchIndexes.push(i)}return matchIndexes}),gt:createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;++i<length;){matchIndexes.push(i)}return matchIndexes})}};Expr.pseudos["nth"]=Expr.pseudos["eq"];for(i in{radio:true,checkbox:true,file:true,password:true,image:true}){Expr.pseudos[i]=createInputPseudo(i)}for(i in{submit:true,reset:true}){Expr.pseudos[i]=createButtonPseudo(i)}function setFilters(){}setFilters.prototype=Expr.filters=Expr.pseudos;Expr.setFilters=new setFilters;tokenize=Sizzle.tokenize=function(selector,parseOnly){var matched,match,tokens,type,soFar,groups,preFilters,cached=tokenCache[selector+" "];if(cached){return parseOnly?0:cached.slice(0)}soFar=selector;groups=[];preFilters=Expr.preFilter;while(soFar){if(!matched||(match=rcomma.exec(soFar))){if(match){soFar=soFar.slice(match[0].length)||soFar}groups.push(tokens=[])}matched=false;if(match=rcombinators.exec(soFar)){matched=match.shift();tokens.push({value:matched,type:match[0].replace(rtrim," ")});soFar=soFar.slice(matched.length)}for(type in Expr.filter){if((match=matchExpr[type].exec(soFar))&&(!preFilters[type]||(match=preFilters[type](match)))){matched=match.shift();tokens.push({value:matched,type:type,matches:match});soFar=soFar.slice(matched.length)}}if(!matched){break}}return parseOnly?soFar.length:soFar?Sizzle.error(selector):tokenCache(selector,groups).slice(0)};function toSelector(tokens){var i=0,len=tokens.length,selector="";for(;i<len;i++){selector+=tokens[i].value}return selector}function addCombinator(matcher,combinator,base){var dir=combinator.dir,skip=combinator.next,key=skip||dir,checkNonElements=base&&key==="parentNode",doneName=done++;return combinator.first?function(elem,context,xml){while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){return matcher(elem,context,xml)}}return false}:function(elem,context,xml){var oldCache,uniqueCache,outerCache,newCache=[dirruns,doneName];if(xml){while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){if(matcher(elem,context,xml)){return true}}}}else{while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){outerCache=elem[expando]||(elem[expando]={});uniqueCache=outerCache[elem.uniqueID]||(outerCache[elem.uniqueID]={});if(skip&&skip===elem.nodeName.toLowerCase()){elem=elem[dir]||elem}else if((oldCache=uniqueCache[key])&&oldCache[0]===dirruns&&oldCache[1]===doneName){return newCache[2]=oldCache[2]}else{uniqueCache[key]=newCache;if(newCache[2]=matcher(elem,context,xml)){return true}}}}}return false}}function elementMatcher(matchers){return matchers.length>1?function(elem,context,xml){var i=matchers.length;while(i--){if(!matchers[i](elem,context,xml)){return false}}return true}:matchers[0]}function multipleContexts(selector,contexts,results){var i=0,len=contexts.length;for(;i<len;i++){Sizzle(selector,contexts[i],results)}return results}function condense(unmatched,map,filter,context,xml){var elem,newUnmatched=[],i=0,len=unmatched.length,mapped=map!=null;for(;i<len;i++){if(elem=unmatched[i]){if(!filter||filter(elem,context,xml)){newUnmatched.push(elem);if(mapped){map.push(i)}}}}return newUnmatched}function setMatcher(preFilter,selector,matcher,postFilter,postFinder,postSelector){if(postFilter&&!postFilter[expando]){postFilter=setMatcher(postFilter)}if(postFinder&&!postFinder[expando]){postFinder=setMatcher(postFinder,postSelector)}return markFunction(function(seed,results,context,xml){var temp,i,elem,preMap=[],postMap=[],preexisting=results.length,elems=seed||multipleContexts(selector||"*",context.nodeType?[context]:context,[]),matcherIn=preFilter&&(seed||!selector)?condense(elems,preMap,preFilter,context,xml):elems,matcherOut=matcher?postFinder||(seed?preFilter:preexisting||postFilter)?[]:results:matcherIn;if(matcher){matcher(matcherIn,matcherOut,context,xml)}if(postFilter){temp=condense(matcherOut,postMap);postFilter(temp,[],context,xml);i=temp.length;while(i--){if(elem=temp[i]){matcherOut[postMap[i]]=!(matcherIn[postMap[i]]=elem)}}}if(seed){if(postFinder||preFilter){if(postFinder){temp=[];i=matcherOut.length;while(i--){if(elem=matcherOut[i]){temp.push(matcherIn[i]=elem)}}postFinder(null,matcherOut=[],temp,xml)}i=matcherOut.length;while(i--){if((elem=matcherOut[i])&&(temp=postFinder?indexOf(seed,elem):preMap[i])>-1){seed[temp]=!(results[temp]=elem)}}}}else{matcherOut=condense(matcherOut===results?matcherOut.splice(preexisting,matcherOut.length):matcherOut);if(postFinder){postFinder(null,results,matcherOut,xml)}else{push.apply(results,matcherOut)}}})}function matcherFromTokens(tokens){var checkContext,matcher,j,len=tokens.length,leadingRelative=Expr.relative[tokens[0].type],implicitRelative=leadingRelative||Expr.relative[" "],i=leadingRelative?1:0,matchContext=addCombinator(function(elem){return elem===checkContext},implicitRelative,true),matchAnyContext=addCombinator(function(elem){return indexOf(checkContext,elem)>-1},implicitRelative,true),matchers=[function(elem,context,xml){var ret=!leadingRelative&&(xml||context!==outermostContext)||((checkContext=context).nodeType?matchContext(elem,context,xml):matchAnyContext(elem,context,xml));checkContext=null;return ret}];for(;i<len;i++){if(matcher=Expr.relative[tokens[i].type]){matchers=[addCombinator(elementMatcher(matchers),matcher)]}else{matcher=Expr.filter[tokens[i].type].apply(null,tokens[i].matches);if(matcher[expando]){j=++i;for(;j<len;j++){if(Expr.relative[tokens[j].type]){break}}return setMatcher(i>1&&elementMatcher(matchers),i>1&&toSelector(tokens.slice(0,i-1).concat({value:tokens[i-2].type===" "?"*":""})).replace(rtrim,"$1"),matcher,i<j&&matcherFromTokens(tokens.slice(i,j)),j<len&&matcherFromTokens(tokens=tokens.slice(j)),j<len&&toSelector(tokens))}matchers.push(matcher)}}return elementMatcher(matchers)}function matcherFromGroupMatchers(elementMatchers,setMatchers){var bySet=setMatchers.length>0,byElement=elementMatchers.length>0,superMatcher=function(seed,context,xml,results,outermost){var elem,j,matcher,matchedCount=0,i="0",unmatched=seed&&[],setMatched=[],contextBackup=outermostContext,elems=seed||byElement&&Expr.find["TAG"]("*",outermost),dirrunsUnique=dirruns+=contextBackup==null?1:Math.random()||.1,len=elems.length;if(outermost){outermostContext=context===document||context||outermost}for(;i!==len&&(elem=elems[i])!=null;i++){if(byElement&&elem){j=0;if(!context&&elem.ownerDocument!==document){setDocument(elem);xml=!documentIsHTML}while(matcher=elementMatchers[j++]){if(matcher(elem,context||document,xml)){results.push(elem);break}}if(outermost){dirruns=dirrunsUnique}}if(bySet){if(elem=!matcher&&elem){matchedCount--}if(seed){unmatched.push(elem)}}}matchedCount+=i;if(bySet&&i!==matchedCount){j=0;while(matcher=setMatchers[j++]){matcher(unmatched,setMatched,context,xml)}if(seed){if(matchedCount>0){while(i--){if(!(unmatched[i]||setMatched[i])){setMatched[i]=pop.call(results)}}}setMatched=condense(setMatched)}push.apply(results,setMatched);if(outermost&&!seed&&setMatched.length>0&&matchedCount+setMatchers.length>1){Sizzle.uniqueSort(results)}}if(outermost){dirruns=dirrunsUnique;outermostContext=contextBackup}return unmatched};return bySet?markFunction(superMatcher):superMatcher}compile=Sizzle.compile=function(selector,match){var i,setMatchers=[],elementMatchers=[],cached=compilerCache[selector+" "];if(!cached){if(!match){match=tokenize(selector)}i=match.length;while(i--){cached=matcherFromTokens(match[i]);if(cached[expando]){setMatchers.push(cached)}else{elementMatchers.push(cached)}}cached=compilerCache(selector,matcherFromGroupMatchers(elementMatchers,setMatchers));cached.selector=selector}return cached};select=Sizzle.select=function(selector,context,results,seed){var i,tokens,token,type,find,compiled=typeof selector==="function"&&selector,match=!seed&&tokenize(selector=compiled.selector||selector);results=results||[];if(match.length===1){tokens=match[0]=match[0].slice(0);if(tokens.length>2&&(token=tokens[0]).type==="ID"&&context.nodeType===9&&documentIsHTML&&Expr.relative[tokens[1].type]){context=(Expr.find["ID"](token.matches[0].replace(runescape,funescape),context)||[])[0];if(!context){return results}else if(compiled){context=context.parentNode}selector=selector.slice(tokens.shift().value.length)}i=matchExpr["needsContext"].test(selector)?0:tokens.length;while(i--){token=tokens[i];if(Expr.relative[type=token.type]){break}if(find=Expr.find[type]){if(seed=find(token.matches[0].replace(runescape,funescape),rsibling.test(tokens[0].type)&&testContext(context.parentNode)||context)){tokens.splice(i,1);selector=seed.length&&toSelector(tokens);if(!selector){push.apply(results,seed);return results}break}}}}(compiled||compile(selector,match))(seed,context,!documentIsHTML,results,!context||rsibling.test(selector)&&testContext(context.parentNode)||context);return results};support.sortStable=expando.split("").sort(sortOrder).join("")===expando;support.detectDuplicates=!!hasDuplicate;setDocument();support.sortDetached=assert(function(el){return el.compareDocumentPosition(document.createElement("fieldset"))&1});if(!assert(function(el){el.innerHTML="<a href='#'></a>";return el.firstChild.getAttribute("href")==="#"})){addHandle("type|href|height|width",function(elem,name,isXML){if(!isXML){return elem.getAttribute(name,name.toLowerCase()==="type"?1:2)}})}if(!support.attributes||!assert(function(el){el.innerHTML="<input/>";el.firstChild.setAttribute("value","");return el.firstChild.getAttribute("value")===""})){addHandle("value",function(elem,name,isXML){if(!isXML&&elem.nodeName.toLowerCase()==="input"){
        return elem.defaultValue}})}if(!assert(function(el){return el.getAttribute("disabled")==null})){addHandle(booleans,function(elem,name,isXML){var val;if(!isXML){return elem[name]===true?name.toLowerCase():(val=elem.getAttributeNode(name))&&val.specified?val.value:null}})}window.Sizzle=Sizzle})(window);
    /**
     * 用Sizzle替代原生的选择器，实现更多功能
     */
    Element.prototype.webkitMatchesSelector = function(s) {
        var matches = window.Sizzle(s),
            i = matches.length;
        while (--i >= 0 && matches[i] !== this) {}
        return i > -1;
    }
    Element.prototype.querySelector = Element.prototype.querySelectorAll = window.Sizzle;


    /**
     * combo selectors
     * @param {string} selectors
     * @returns {string}
     */
    function normalizeSelectors(selectors){
        if(Object.prototype.toString.call(selectors) === '[object Array]'){
            return selectors.join(',');
        } else {
            return String(selectors || '');
        }
    }

    // walk settings
    var INVISIBLE_ELEMENT = data.invisibleElements;
    var IGNORE_CHILDREN_ELEMENT = data.ignoreChildrenElements;
    var STYLE_FILTERS = data.styleFilters;
    var ATTR_FILTERS = data.attributeFilters;
    // var INCLUDE_SELECTORS = normalizeSelectors(data.includeSelectors);
    var EXCLUDE_SELECTORS = normalizeSelectors(data.excludeSelectors);
    var IGNORE_CHILDREN_SELECTORS = normalizeSelectors(data.ignoreChildrenSelectors);
    var IGNORE_TEXT_SELECTORS = normalizeSelectors(data.ignoreTextSelectors);
    var IGNORE_STYLE_SELECTORS = normalizeSelectors(data.ignoreStyleSelectors);
    var ROOT = data.root || 'body';

    // reg
    var invisibleElementReg = new RegExp('^(' + INVISIBLE_ELEMENT.join('|') + ')$', 'i');
    var ignoreChildrenElementReg = new RegExp('^(' + IGNORE_CHILDREN_ELEMENT.join('|') + ')$', 'i');

    /**
     * invisible
     * @param {HTMLElement} elem
     * @returns {boolean}
     */
    function isInvisible(elem){
        var tagName = elem.tagName.toLowerCase();
        invisibleElementReg.lastIndex = 0;
        return (invisibleElementReg.test(tagName) || (tagName === 'input' && elem.type === 'hidden'));
    }

    /**
     * ignore child
     * @param {HTMLElement} elem
     * @returns {boolean}
     */
    function igonreChildren(elem){
        ignoreChildrenElementReg.lastIndex = 0;
        return ignoreChildrenElementReg.test(elem.tagName) ||
              (IGNORE_CHILDREN_SELECTORS && elem.webkitMatchesSelector(IGNORE_CHILDREN_SELECTORS));
    }

    /**
     * get computed styles of element, and hash them
     * @param {HTMLElement} elem
     * @returns {string}
     */
    function getStyles(elem){
        var ret = [];
        var filters = STYLE_FILTERS.slice(0);
        if(igonreChildren(elem)){
            filters.width = true;
            filters.height = true;
        }
        var styles = elem.ownerDocument.defaultView.getComputedStyle( elem, null );
        var display = styles.getPropertyValue('display');
        var opacity = styles.getPropertyValue('opacity');
        var visibility = styles.getPropertyValue('visibility');
        if(display === 'none' || opacity === '0' || visibility === 'hidden'){
            return false;
        } else {
            var position = styles.getPropertyValue('position');
            if(position !== 'static'){
                filters.push('top', 'right', 'bottom', 'left');
            }
            filters.forEach(function(key){
                ret.push(styles.getPropertyValue(key));
            });
        }
        return md5(ret.join('~'));
    }

    /**
     * get element bounding rect
     * @param {HTMLElement} elem
     * @returns [x, y, width, height]
     */
    function getRect(elem){
        var rect = elem.getBoundingClientRect();
        var doc = elem.ownerDocument;
        var win = doc.defaultView;
        var html = doc.documentElement;
        var x = Math.floor(rect.left + win.pageXOffset - html.clientLeft);
        var y = Math.floor(rect.top + win.pageYOffset - html.clientTop);
        var w = Math.floor(rect.width);
        var h = Math.floor(rect.height);
        return [x, y, w, h];
    }

    /**
     * get attributes of element
     * @param {HTMLElement} elem
     * @returns {Object|boolean}
     */
    function getAttr(elem){
        var ret = {};
        var filters = ATTR_FILTERS.slice(0);
        var hasAttr = false;
        if(elem.tagName.toLowerCase() === 'input'){
            filters.push('type');
        }
        filters.forEach(function(key){
            var attr = elem.getAttribute(key);
            if(attr !== null){
                hasAttr = true;
                ret[key] = attr;
            }
        });
        return hasAttr ? ret : false;
    }

    /**
     * filter elements
     * @param {HTMLElement} elem
     * @param {HTMLElement} parent
     * @returns {boolean}
     */
    function filter(elem, parent){
        var ret = true;
        switch (elem.nodeType){
            case 1:
                if(EXCLUDE_SELECTORS){
                    ret = ret && !elem.webkitMatchesSelector(EXCLUDE_SELECTORS);
                }
                // if(INCLUDE_SELECTORS){
                //     ret = ret && elem.webkitMatchesSelector(INCLUDE_SELECTORS);
                // }
                break;
            case 3:
                if(IGNORE_TEXT_SELECTORS){
                    ret = ret && !parent.webkitMatchesSelector(IGNORE_TEXT_SELECTORS);
                }
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    }

    /**
     * walk dom tree
     * @param {HTMLElement} elem
     * @returns {Object}
     */
    function walk(elem){
        var node = {};
        if(elem.nodeType === 1){    // element
            node.name = elem.tagName.toLowerCase();
            if(!isInvisible(elem)){
                node.rect = getRect(elem);
                var attr = getAttr(elem);
                if(attr){
                    node.attr = attr;
                }
                if(IGNORE_STYLE_SELECTORS && elem.webkitMatchesSelector(IGNORE_STYLE_SELECTORS)){
                    node.style = '';
                } else {
                    node.style = getStyles(elem);
                }
                node.child = [];
                if(node.name === 'img'){
                    if(!(IGNORE_TEXT_SELECTORS && elem.webkitMatchesSelector(IGNORE_TEXT_SELECTORS))){
                        var canvas = document.createElement('canvas');
                        canvas.width = elem.offsetWidth;
                        canvas.height = elem.offsetHeight;
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(elem, 0, 0);
                        // not ignore text
                        node.child.push({
                            name: '#',
                            text: md5(canvas.toDataURL())
                        });
                    }
                } else if(igonreChildren(elem)){ // ignore children
                    if(!(IGNORE_TEXT_SELECTORS && elem.webkitMatchesSelector(IGNORE_TEXT_SELECTORS))){
                        // not ignore text
                        node.child.push({
                            name: '#',
                            text: md5(elem.innerText.replace(/\s+/g, ' '))
                        });
                    }
                } else {
                    for(var i = 0, len = elem.childNodes.length; i < len; i++){
                        var child = elem.childNodes[i];
                        if(filter(child, elem)){    // recursion
                            var vdom = arguments.callee(child);  //
                            if(typeof vdom !== 'undefined' && vdom.style !== false){
                                node.child.push(vdom);
                            }
                        }
                    }
                }
                return node;
            }
        } else if(elem.nodeType === 3) {    // text node
            var text = elem.nodeValue.trim();
            if(text){
                node.name = '#';
                node.text = md5(text);
                return node;
            }
        }
    }

    if(data.removeSelectors && data.removeSelectors.length){
        data.removeSelectors.forEach(function(selector){
            var elems = document.querySelectorAll(selector);
            for(var i = 0, len = elems.length; i < len; i++){
                var elem = elems[i];
                elem.parentNode.removeChild(elem);
                elem = null;
            }
        });
    }
    return walk(document.querySelector(ROOT));

};