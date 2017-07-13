var Twit=require('twit');//we can get this package details from www.npmjs.com
var T = new Twit({
  consumer_key:         'q7jSHVoUPF655tBLSF4MMKKn6',
  consumer_secret:      'S6pxJm4EFXYSbTb6ctpyrecOvgDnE5VGa7sDrdtFuCVboXEw0E',
  access_token:         '877811802767216640-VYY3roSg2Ld5SCugt2GNiKnunUZ0Nbh',
  access_token_secret:  '6NZXPADZbQPsgYmJ7ufG6CkbaKh1SsiVRaTkYFiOyPoXp',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})



var statusIDStore=['884282363504504832','884282127742672896','884282127742672896','884441090098679808','884409495761321984','884446696431788032','884292479515713536','882854491392942080','884451045736194049','884451113843412992'];
var userIdStoreJson=[];
function getRetweetersbyStatusID(){
    getNextStatusID(statusIDStore,0,function(){
        console.log("finished finding retweeters"+userIdStoreJson);
        console.log("");
    })
}
setInterval(getRetweetersbyStatusID,4000)
//getRetweetersbyStatusID();
function getNextStatusID(stId,stindex,done){
    if(stId.length==stindex){
        done();
    }
    else{
        statusID=stId[stindex];
        console.log(statusID);
        getNextRetweeter(statusID,0,function(){
            stindex++;
            getNextStatusID(stId,stindex,done)
        })
    }

}

function getNextRetweeter(statusId,index,success){

    T.get('statuses/retweeters/ids', {id:statusId,count:5 },function(error, data, response){

     if(!error){
    
        var status=getStatus(statusId,data);
        for(var i=0;i<data.ids.length;i++){
            if(status.userIds.indexOf(data.ids[i])>-1){
                console.log(data.ids[i]+" user already exist of status Id "+statusId);
            }
            else{
                status.userIds.push(data.ids[i]);
                console.log(data.ids[i]+" new user added")
            }
            
            }
            success();
        }
        else{
            console.log("error in getting retweeters"+error);
            success();
        }

      })
      
}
function getStatus(id,data)
{
   if(userIdStoreJson==null || userIdStoreJson.length==0)
   {
       var status={};
       status.Id=id;
       status.userIds=[];
       userIdStoreJson.push(status);
       return status;
   }
   for(var i=0;i<userIdStoreJson.length;i++){
       if(userIdStoreJson[i].Id==id){
           
           return userIdStoreJson[i];
       }
   }
   for(var i=0;i<userIdStoreJson.length;i++){

       if(userIdStoreJson[i].Id!=id){
           var status={};
           status.Id=id;
           status.userIds=[];
           userIdStoreJson.push(status);
           console.log("status id "+status.Id)
           return status;
       }

   }
}