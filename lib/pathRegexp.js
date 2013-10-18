module.exports = function(routeStr){
 // /doc/:id 符合这个泛式的url可以是 /doc/id0001。
 // /doc/title/* 符合这个泛式的url可以是 /doc/title/abcd 或 /doc/title
 // /\/article\/(.*)\/(.*)$/god
    var params = [];
    routeStr = routeStr.replace(/\?.*$/,'')
                        .replace(/(\*{1}(?=\/))|(\*{1}.*$)/g,'(.*)')
                        .replace(/(:(.*?)(?=\/))|(:(.*)$)/g,function(){
                           for(var i=0,len=arguments.length-2;i<len;i++){
                              var arg = arguments[i+1];
                              if(typeof arg === 'string' && arg[0] !== ':'){
                                params.push(arg);
                              }
                            }
                          return '(.*)';
                        }).replace(/\//g,'\\\/');
    var reg = new RegExp(routeStr + '$');
    reg.paramNames = params;                      
    return  reg;
}