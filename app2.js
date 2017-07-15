var kafka = require('kafka-node')
var Producer = kafka.Producer
var client = new kafka.Client("localhost:2181/")

var twitterTopic = "twitter";
    KeyedMessage = kafka.KeyedMessage,
    producer = new Producer(client),
    km = new KeyedMessage('key', 'message'),
    countryProducerReady = false;



var Twit=require('twit');//we can get this package details from www.npmjs.com
var T = new Twit({
  consumer_key:         'q7jSHVoUPF655tBLSF4MMKKn6',
  consumer_secret:      'S6pxJm4EFXYSbTb6ctpyrecOvgDnE5VGa7sDrdtFuCVboXEw0E',
  access_token:         '877811802767216640-VYY3roSg2Ld5SCugt2GNiKnunUZ0Nbh',
  access_token_secret:  '6NZXPADZbQPsgYmJ7ufG6CkbaKh1SsiVRaTkYFiOyPoXp',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

var statusIDStore=[];
var stream = T.stream('statuses/filter', {track: '#GST'})
 
stream.on('tweet', function (tweet) {
  var status={};
  status.id=tweet.id_str;
  status.name=tweet.text;
  statusIDStore.push(status);
  console.log(tweet.text+" added ")
})

stream.on('error',function(err){
  
  console.log(err);
})
//-----------------------------------------end of getting status id-------------
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

//-------------------------------------end of getting retweeter Id--------------------------

function getRetweetedUser(){

    getNextStatus4(userIdStoreJson,0,function(){
    console.log("finished findng user details"+ userIdStoreJson)
})

}

setInterval(getRetweetedUser,4000);


function getNextStatus4(usrJson,index,done){

    if(usrJson.length==index){
        done();
    }
    else{
         var statusdetails=usrJson[index];
         var userdIDS=userIdStoreJson[index].userIds;
         getNextUserId(statusdetails,0,function(){
         index++;
         getNextStatus4(usrJson,index,done)
        })
       }
}

function getNextUserId(userDetails,userIndex,success){
    var userIDs=userDetails.userIds
    if(userIDs.length==userIndex){
        success();
    }
    else{
        //check is user processd
        var userId=userIDs[userIndex];
        var userDtls={};
        userDtls.statusId=userDetails.Id;
        userDtls.name=userDetails.name;
        userDtls.userId=userIDs[userIndex];
        if(userId.isProcessed){
            // user details alredy processed
            //go to next iteration
            userIndex++;
            getNextUserId(userDetails,userIndex,success)    
        }
        else
        {
            //get user details
            getUserByUserId(userDtls,function(){
                userId.isProcessed=true;
            userIndex++;
            getNextUserId(userDetails,userIndex,success)
        })
        }
    }
    
}

function getUserByUserId(uDetail,success){
    var uId=uDetail.userId.userId;
    T.get('users/show', {user_id:uId},
        function(error, users, response)
        {
        if (!error) 
        { 
          
          console.log("user name "+users.name+" of status "+uDetail.name+" of id "+uDetail.statusId);
          var dataToKafka={};
          dataToKafka.status=uDetail.name;
          dataToKafka.stusId=uDetail.statusId;
          dataToKafka.userName=users.name;

          doKafka(dataToKafka,function(payloads){
            producer.send(payloads, function (err, loadeddata) {
          console.log(loadeddata);
          console.log(payloads);

          console.log("");
          success();
          });

        });

                //-------------------------------------------------------
        function doKafka(dataToKafka,addData)
          {
             
             KeyedMessage = kafka.KeyedMessage,
          twitterKM = new KeyedMessage(dataToKafka.statussId, JSON.stringify(dataToKafka)),
          payloads = [
                      { topic: twitterTopic, messages: twitterKM, partition: 0 },
                     ];
          
          addData(payloads);
          } 


        }
        else 
        {console.log(error.message+" user id "+uId);
         
          success();
        }

      });
    
}