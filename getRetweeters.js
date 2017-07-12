var Twit=require('twit');//we can get this package details from www.npmjs.com
var T = new Twit({
  consumer_key:         'q7jSHVoUPF655tBLSF4MMKKn6',
  consumer_secret:      'S6pxJm4EFXYSbTb6ctpyrecOvgDnE5VGa7sDrdtFuCVboXEw0E',
  access_token:         '877811802767216640-VYY3roSg2Ld5SCugt2GNiKnunUZ0Nbh',
  access_token_secret:  '6NZXPADZbQPsgYmJ7ufG6CkbaKh1SsiVRaTkYFiOyPoXp',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})



var statusIDStore=['884282363504504832','884282127742672896']; var v=[884282127742672896,884441090098679808,884409495761321984,884446696431788032,884292479515713536,882854491392942080,884451045736194049,884451113843412992];
var userIdStoreJson={};
var loop=0;
function getRetweetersbyStatusID(){
    getNextStatusID(statusIDStore,0,function(){
        console.log("finished finding retweeters"+userIdStoreJson);
        console.log("");
    })
}
setInterval(getRetweetersbyStatusID,9000)
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
    
        var userIds=data.ids;
        var userArray=[];
        var userIDStore={};
        var statusIndex=0;
        userIDStore.statusID=statusId;
        if(!error){
            for(var i=0;i<userIds.length;i++){

                var userId=userIds[i]+'';
                    var userStorage=[];
                    var jsonUsr=JSON.stringify(userIdStoreJson);
                    console.log(jsonUsr.length);
                    var keys=Object.keys(userIdStoreJson)
                    var keyValue=keys[index];
                    console.log(keyValue);
                    if(loop>0){
                        if(keys[index].includes(statusId)){
                        if(loop>0){
                       for(var j=0;j<userIdStoreJson[statusId].length;j++){
                       userStorage.push(userIdStoreJson[statusId][j]);
                       }
                    }
                    else{
                        console.log("error")
                    }

                    }else{console.log("error2")}

                    }
                    
                    
                    //userIdStoreJson[statusId]=userStorage;
                    console.log(userStorage);

                    if(userStorage.indexOf(userId) > -1){
                    console.log("user id already exist")
                    }
                
                else{
                    userArray.push(userId);
                    console.log(statusId+"'s userID added"+userId);
                    }

                
                
            }
            userIDStore.users=userArray;
            console.log(userArray);
            //userIdStoreArray
            userIdStoreJson["'"+statusId+"'"]=userArray;
            loop++;
            //userIdStoreArray.push(userIDStore);
            statusIndex++;
            success();
            
        }
        else{
            console.log("error in getting retweeters"+error)
        }

      })
      
}