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



var userIdStoreJson=[{Id: "884282363504504832",name:'hello everyone', userIds:[{userId:'142665380',isProcessed:false},{userId:'3171530662',isProcessed:false},{userId:'916232876',isProcessed:false}]},
                 {Id: "884282127742672896",name:'god is great', userIds:[{userId:'3305960346',isProcessed:false},{userId:'3230298888',isProcessed:false}]}]


function getRetweetedUser(){

    getNextStatus4(userIdStoreJson,0,function(){
    console.log("status finished"+ userIdStoreJson)
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