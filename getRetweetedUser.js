
var userIdsJson=[{Id: "884282363504504832", userIds:['142665380','3171530662','916232876']},
                 {Id: "884282127742672896", userIds:['3305960346','3230298888']}]

var allUserDetailsJson=[]                 


getNextStatus(userIdsJson,0,function(){
    console.log("status finished"+ allUserDetailsJson)
})

function getNextStatus(usrJson,index,done){

    if(usrJson.legth==index){
        done();
    }
    var statusId=usrJson[index].Id;
    console.log(statusId);
    var userdIDS=userIdsJson[index].userIds;
    getNextUserId(userdIDS,0,function(){
        index++;
        getNextStatus(usrJson,index,done)
    })
}

function getNextUserId(userIDs,userIndex,success){
    if(userIDs.legth==userIndex){
        success();
    }

    var userId=userIDs[userIndex];
    getUserByUserId(userId,function(){
        userIndex++;
        getNextUserId(userIDs,userIndex,success)
    })

}

function getUserByUserId(uId,success){
    console.log(uId);
    success();
}