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

var screenName=["HARDWELL"];var a=["twitApp123","virendersehwag","narendramodi"];
var statusIDStore=[];

function getTweetsByScreenName(){
    getNextScreenName(screenName, 0,function(){
    console.log("end of statuses"+statusIDStore)
});

}

setInterval(getTweetsByScreenName,4000)
//getTweetsByScreenName();


function getNextScreenName(nameList,keyIndex,success){

    if(nameList.length==keyIndex)
    {
        success();
    }
    else{
         sn=nameList[keyIndex];
    
    getNextStatus(sn,0,function(){
            keyIndex++;
        getNextScreenName(nameList,keyIndex,success)
        })

    }
   
    
}

function getNextStatus(key,index,done){
    var params={
    screen_name:key,
    count:2
    }

    T.get("statuses/user_timeline",params,function(err,data,response){

    
    if(!err){

            for(var i=0;i<data.length;i++){
                
                 var sId=data[i].id_str;
                 var status=getStatus(sId);
                 var obj = statusIDStore.filter(function ( obj ) 
                {
                return obj.id === sId;
                })[0];
                if(obj){
                console.log(sId+" already exist ");
                }
                else{
                    status.id=sId;
                    status.name=data[i].text
                    statusIDStore.push(status);
                    console.log(data[i].user.name+"'s data added");
                }
                
            }
            
            done();
            
    }
    else{
        console.log(err)
        done();
        
    }
      

});

}

function getStatus(id){
    if(statusIDStore==null||statusIDStore.length==0){
        var status1={};
        status1.id='';
        status1.name="";
        return status1;
    }
    for(var i=0;i<statusIDStore.length;i++){
       if(statusIDStore[i].id==id){
           
           return statusIDStore[i];
       }
   }
   for(var i=0;i<statusIDStore.length;i++){
       if(statusIDStore[i].id!=id){
           var status1={};
           status1.id='';
           status1.name="";
           return status1;
       }
   }

}

// --------------------end of extracting statusId-----------


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