var querystring = require('querystring');

module.exports = function post(req,res,next){
   
   req.files = {};
   req.body = {};   
   var body_data = '';
   
   req.on('data',function(chunk){
      body_data += chunk;
   });
   
   req.on('end',function(){

      var content_type = req.headers['content-type'];
      
      var isMuilt = /(boundary=)/gi.test(content_type);
      if(isMuilt){
         var  boundary = RegExp["$'"];
      
         var bundaryStandard = '--' + boundary + '\r\n';
         var endBundart = boundary + '--\r\n';
  
         body_data = body_data.substring(bundaryStandard.length,body_data.length - endBundart.length - 2);
  
         var fields =  body_data.split(bundaryStandard);
         
         var RN = '\r\n\r\n';
         fields.forEach(function(field){
            
            var index = field.indexOf(RN),
                header = field.substring(0,index);
                
            /name=\"(.*?)\"/g.test(header);
            
            var fieldName = RegExp.$1,
                isFile = /filename/g.test(header);
                
            var bd = field.substring(index + RN.length),
                bd = bd.substring(0,bd.length - RN.length/2);
                
            if(isFile){
               req.files[fieldName] = new Buffer(bd);
            }else{
               req.body[fieldName] = bd;
            }   
              
         });
      }else{
        try{
          req.body = querystring.parse(body_data);  
        }catch(e){}
      }
      
      next();
   });
}
