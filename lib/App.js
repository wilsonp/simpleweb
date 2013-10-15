var http = require('http');

function App(){
  var self = this;
  
  this._getHandle = null;
  this._postHandle = null;
    
  var middleWareList = this._middleWareList = [];

  function handle(req,res){
     if(middleWareList.length === 0){
      //
     } else{
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
             switch(req.method){
               case "GET" :
                  if(self._getHandle){
                     self._getHandle(req,res);
                  }
                  break;
               case "POST":
                  if(self._postHandle){
                      self._postHandle(req,res);
                  }
                  break;   
             }
          }
       }
    }
  }
  
  this._server = http.createServer(handle);
}

App.prototype.use = function(middleWare){
  this._middleWareList.push(middleWare);
}

App.prototype.get = function(handle){
  this._getHandle = handle;
}

App.prototype.post = function(handle){
  this._postHandle = handle;
}

App.prototype.listen = function(){
  this._server.listen.apply(this._server,arguments);
}

module.exports = App;

