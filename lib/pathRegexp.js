module.exports = function(routeStr){
 // /doc/:id 符合这个泛式的url可以是 /doc/id0001。
 // /doc/title/* 符合这个泛式的url可以是 /doc/title/abcd 或 /doc/title
 // /\/article\/(.*)\/(.*)$/god
    routeStr = routeStr.replace(/\?.*$/,'')
                        .replace(/(\*{1}(?=\/))|(\*{1}.*$)/g,'.*')
                        .replace(/(:(.*?)(?=\/))|(:.*$)/g,'.*')
                        .replace(/\//g,'\\\/');
    var reg = new RegExp(routeStr + '$'); 
    
    console.log(reg);
                           
    return  reg;
}