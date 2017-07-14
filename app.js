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

//setInterval(getTweetsByScreenName,4000)
getTweetsByScreenName();


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
                // var status=getStatus(sId);


                if(statusIDStore==null||statusIDStore.length==0){
                    var statusArray=[];
                    var status={};
                    status.id='';
                    statusArray.push(status);
                  }
                  else{
                      var statusArray=statusIDStore;
                  }

                
                var result = statusArray.map(function(a) {return a.id;});

                var statusId=data[i].id_str;
                if(result.indexOf(sId) > -1){
                    console.log("already exist")
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
        status1.id=id;
        status1.name="";
        return status1;
    }
    for(var i=0;i<statusIDStore.length;i++){
       if(statusIDStore[i].Id==id){
           
           return statusIDStore[i];
       }
   }
   for(var i=0;i<statusIDStore.length;i++){
       if(statusIDStore[i].Id!=id){
           var status1={};
           status1.id=id;
           status1.name="";
           return status1;
       }
   }

}

// --------------------end of extracting statusId-----------

function getRetweetersbyStatusID(){
    getNextStatusID(statusId,0,function(){
        console.log("finished finding retweeters")
    })
}

