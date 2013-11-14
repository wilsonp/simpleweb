var querystring = require('querystring');

module.exports = function post(req,res,next){
   
   req.files = {};
   req.body = {};   
   var body_data,
       chunk_list = [],
       content_type = req.headers['content-type'],
       isMuilt = /(boundary=)/gi.test(content_type),
       boundary = RegExp["$'"],
       bundaryStandard = '--' + boundary + '\r\n',
       endBundart = '--' + boundary + '--\r\n';
   
   req.on('data',function(chunk){
      chunk_list.push(chunk);
   });
   
   req.on('end',function(){
      body_data = Buffer.concat(chunk_list); 

      if(isMuilt){

         var backup = [];//存储怀疑字符
         var body = [];

         var postion = 0,
             read_state = 0;//读取状态 0-分隔符 1-消息头 2-消息体

         function handle(b){
            switch(read_state){
              case 0:
                if(body_data.slice(postion,postion + bundaryStandard.length).toString() === bundaryStandard){
                   if(backup.length > 0){//如果backup不为空则表示该位置不是起始分隔符，而是中间的分隔符，且backup中的数据是body体数据
                      body.push(backup);
                      backup = [];
                     // postion += 1;
                   }else{//说明是起始分隔符，则直接跳过分隔符，开始读取消息头（将read_state设置为1）
                      postion += bundaryStandard.length;
                      read_state = 1;
                   }
                }else if(body_data.slice(postion,postion + endBundart.length).toString() === endBundart){
                   if(backup.length > 0){
                     body.push(backup);
                   }
//console.log('body.size:' + body.length);
                   return true;
                }else{    //一直读取‘-’
                   backup.push(b);
                   postion += 1;
                }
                break;
              case 1:
                if(backup.length >= 3){
                   var arr4 = backup.slice(backup.length - 3,backup.length);
                   arr4.push(b);
                   backup.push(b);
                   if(new Buffer(arr4).toString() === '\r\n\r\n'){  //说明消息头读完紧接着需呀读取消息体
                      body.push(backup);
                      backup = [];
                      read_state = 2; 
                   }
                   
                }else{
                   backup.push(b);
                }
                postion += 1;
                break;
              case 2:
                backup.push(b);
                postion += 1;
                break;
            }
         }
         for(var len =body_data.length;postion<len;){

            var b = body_data[postion];
            if(read_state === 0 || read_state === 2 ){
               if(b === 45){
                  read_state = 0;
               }else{
                  read_state = 2;
               }
            }

            var end = handle(b);

            if(end){
              
// console.log('body.length:'+body.length);
              
              for(var i=0,len = body.length;i<len;){
                 var header = new Buffer(body[i]).toString();
//console.log('header:' + header);
                 /name=\"(.*?)\"/g.test(header);
                 
                 var fieldName = RegExp.$1,
                     isFile = /[^\"]filename/g.test(header);
                
//console.log('i:' + i + ',fieldName:' + fieldName + ',isFile:' + isFile);

                 var arr = body[i + 1];
                 
//console.log('arr:' + arr);

                 var data = new Buffer(arr.slice(0,arr.length - 2)); //删除消息体后面的\r\n 13 10
                     
                 if(isFile){
                    req.files[fieldName] = (data.length === 0 ? null : data);
                 }else{
                    req.body[fieldName] = data.toString();
                 }  
                 i += 2;
//console.log('fieldName:' + fieldName + ',data:' + req.files[fieldName]);  
              } 
              break;
            }  
         }
      }else{
        try{
          req.body = querystring.parse(body_data.toString());  
        }catch(e){}
      }
      next();
   });
}
