var Twit=require('twit');//we can get this package details from www.npmjs.com
var T = new Twit({
  consumer_key:         'q7jSHVoUPF655tBLSF4MMKKn6',
  consumer_secret:      'S6pxJm4EFXYSbTb6ctpyrecOvgDnE5VGa7sDrdtFuCVboXEw0E',
  access_token:         '877811802767216640-VYY3roSg2Ld5SCugt2GNiKnunUZ0Nbh',
  access_token_secret:  '6NZXPADZbQPsgYmJ7ufG6CkbaKh1SsiVRaTkYFiOyPoXp',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})



var statusIDStore=[{id:'884282363504504832',name:'hello everyone'},{id:'884282127742672896',name:'world is wonderful'}];
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
        statusID=stId[stindex]
        console.log(statusID);
        getNextRetweeter(statusID,0,function(){
            stindex++;
            getNextStatusID(stId,stindex,done)
        })
    }

}

function getNextRetweeter(status2,index,success){
    var statusId=status2.id;
    T.get('statuses/retweeters/ids', {id:statusId,count:5 },function(error, data, response){

     if(!error){
    
        var status=getStatus2(status2);
        for(var i=0;i<data.ids.length;i++){

            var obj = status.userIds.filter(function ( obj ) 
            {
                return obj.userId === data.ids[i];
            })[0];
            if(obj){
                console.log(data.ids[i]+" user already exist of status Id "+statusId);
            }
            else{
                var temp={};
                temp.userId=data.ids[i];
                temp.isProcessed=false;
                status.userIds.push(temp);
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
function getStatus2(statusDetails)
{
   if(userIdStoreJson==null || userIdStoreJson.length==0)
   {
       var status={};
       status.Id=statusDetails.id;
       status.name=statusDetails.name;
       status.userIds=[];
       userIdStoreJson.push(status);
       return status;
   }
   for(var i=0;i<userIdStoreJson.length;i++){
       if(userIdStoreJson[i].Id==statusDetails.id){
           
           return userIdStoreJson[i];
       }
   }
   for(var i=0;i<userIdStoreJson.length;i++){

       if(userIdStoreJson[i].Id!=statusDetails.id){
           var status={};
           status.Id=statusDetails.id;
           status.name=statusDetails.name;
           status.userIds=[];
           userIdStoreJson.push(status);
           console.log("status id "+status.Id)
           return status;
       }

   }
}