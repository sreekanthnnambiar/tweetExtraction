var Twit=require('twit');//we can get this package details from www.npmjs.com
var T = new Twit({
  consumer_key:         'q7jSHVoUPF655tBLSF4MMKKn6',
  consumer_secret:      'S6pxJm4EFXYSbTb6ctpyrecOvgDnE5VGa7sDrdtFuCVboXEw0E',
  access_token:         '877811802767216640-VYY3roSg2Ld5SCugt2GNiKnunUZ0Nbh',
  access_token_secret:  '6NZXPADZbQPsgYmJ7ufG6CkbaKh1SsiVRaTkYFiOyPoXp',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

var screenName=["narendramodi","HARDWELL","virendersehwag","twitApp123"];
var statusIDStore=[];

function getTweetsByScreenName(){
    getNextScreenName(screenName, 0,function(){
    console.log("end of statuses"+statusIDStore)
});

}

setInterval(getTweetsByScreenName,4000)


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
                
                var statusId=data[i].id_str;
                if(statusIDStore.indexOf(statusId) > -1){
                    console.log("already exist")
                }
                else{
                    statusIDStore.push(statusId);
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

// --------------------end of extracting statusId-----------

function getRetweetersbyStatusID(){
    getNextStatusID(statusId,0,function(){
        console.log("finished finding retweeters")
    })
}

