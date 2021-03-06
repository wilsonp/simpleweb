var http = require('http');
var url = require('url');
var pathRegexp = require('./pathRegexp.js');

function App(){
  var self = this;

  this._route_get_handle = [];
  this._route_post_handle = [];
    
  var middleWareList = this._middleWareList = [];

  function handle(req,res){

     req.params = {};
     var middleIndex = 0;
     execMiddle();
     
     function next(){
       middleIndex += 1;
       execMiddle(); 
     }
     
     function execMiddle(){
      // console.log('middleIndex:' + middleIndex);
        var middle = middleWareList[middleIndex];
        if(middle){
           middle(req,res,next);
        }else{
           var handle;
           //将/artical?name=zhang --> /artical
           var path = url.parse(req.url).pathname;
           
           function findHandle(route_handles){
              for(var i=0,len=route_handles.length;i<len;i++){
                 var route_handle = route_handles[i];
                 var pass = route_handle.route.test(path);                
                 if(pass){
                    route_handle.route.paramNames.forEach(function(name,index){
                       req.params[name] = RegExp['$' + (index + 1)]; 
                    });
                    handle = route_handle.handle;
                    break; 
                 }
              }
           }
           
           switch(req.method){
             case "GET" :
                // handle = self._route_get_handle[req.url];
                findHandle(self._route_get_handle);
                break;
             case "POST":
                //handle = self._route_post_handle[req.url];
                findHandle(self._route_post_handle);
                break;
           }
           
          // console.log('path:' + path + ',handle:' + handle);
           
           if(handle){             
              handle(req,res);
           }else{
              res.statusCode = 404;
              res.end();
           }
        }
     }
  }
  
  this._server = http.createServer(handle);
}

App.prototype.use = function(middleWare){
  this._middleWareList.push(middleWare);
}

App.prototype.get = function(route,handle){
  this._route_get_handle.push({route:pathRegexp(route),handle:handle});
}

App.prototype.post = function(route,handle){
  this._route_post_handle.push({route:pathRegexp(route),handle:handle});
}

App.prototype.listen = function(){
  this._server.listen.apply(this._server,arguments);
}

module.exports = App;

