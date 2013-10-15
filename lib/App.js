var http = require('http');

function App(){
  var self = this;

  this._route_get_handle = {};
  this._route_post_handle = {};
    
  var middleWareList = this._middleWareList = [];

  function handle(req,res){
     var middleIndex = 0;
     execMiddle();
     
     function next(){
       middleIndex += 1;
       execMiddle(); 
     }
     
     function execMiddle(){
        var middle = middleWareList[middleIndex];
        if(middle){
           middle(req,res,next);
        }else{
           var handle;
           switch(req.method){
             case "GET" :
                handle = self._route_get_handle[req.url];
                break;
             case "POST":
                handle = self._route_post_handle[req.url];
                break;   
           }
           if(handle){
              handle(req,res);
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
  this._route_get_handle[route] = handle;
}

App.prototype.post = function(route,handle){
  this._route_post_handle[route] = handle;
}

App.prototype.listen = function(){
  this._server.listen.apply(this._server,arguments);
}

module.exports = App;

