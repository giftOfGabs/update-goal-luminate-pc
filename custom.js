//loadCustom is built in funciton available in Particiapnt Center. It loads only after rest of Particpant Center has finished loading. Use this to fire our fucntion 

var loadCustom = function() {
    YAHOO.Convio.PC2.Utils.require("pc2:registrationLoaded", "pc2:constituentLoaded", "pc2:configurationLoaded", "pc2:wrapperLoaded", function() {
		getTeamMembers();
	});//end loadCustom
    
};
var getTeamMembers = function(){
	var newTeamGoal = 0;
	var teamGoalText = jQuery('#team-progress-goal-value').text();
    var teamGoalSplit = teamGoalText.split('$');
    var teamGoal = teamGoalSplit[1];
    //grabbing value embedded in PC config page with stags
    var teamCap = jQuery('#captain').text();
    var teamName = jQuery('#team-name-field').text();
    var teamID = jQuery('#teamID').text();    
    var frID = jQuery('#frID').text();
    //grabbing value of S86 embedded in PC
    var auth = jQuery('#auth').val();
        
    console.log("Team Goal for "+teamName+"("+teamID+") in event id "+frID+" is currently "+teamGoal);
    
    apiUrl = 'https://secure3.convio.net/clientName/site/CRTeamraiserAPI?';
    apiKey = 'apiKeyGoesHere';
    apiCallgetTeam = apiUrl+'method=getTeamMembers&api_key='+apiKey+'&v=1.0&team_id='+teamID+'&fr_id='+frID+'&response_format=json';
   
    if(teamCap == true){
	    jQuery.getJSON(apiCallgetTeam, function(data){
	        var teamData = data;
	        if(teamData.getTeamMembersResponse.member == 0){
	            console.log('no team');
	        }else{
	            jQuery.each(teamData.getTeamMembersResponse.member, function(){
	                var consID = this.consId;               
	                var callbackUrl = 'https://secure3.convio.net/clientName/site/SPageServer?pagename=callback_team&fr_id='+frID+'&consID='+consID+'&pgwrap=n&callback=?';
	                jQuery.ajax({
	                    type: 'GET',
	                    url: callbackUrl,
	                    async:false,
	                    jsonpCallback: 'jsonpCallback',
	                    cotnentType: 'text/html',
	                    dataType:'json',
	                    success: function(data){                 
	                       //console.dir(data.participationType);
	                       var partTypeStr = data.participationType[0].partType;
	                       var partGoal = data.participationType[0].goal;
	                       var min = data.participationType[0].minimum;
	                       var minNum = parseFloat(min);
	                       console.log('min: ' +minNum);
	                       newTeamGoal += minNum;
	                    },
	                    error: function(e) {
	                       console.log('fail: ' + first + ' ' + last);
	                    }
	                });                
	            });
	            console.log(newTeamGoal);
	            if (newTeamGoal > teamGoal) {
	            	//adding two zeros as api wants data in cents
	            	newTeamGoal += '00';
	            	console.log('updating team goal to '+newTeamGoal);
	            	postTeamGoal(newTeamGoal,frID,apiKey,auth);
	            }
	        }
    	});
	}
}
var postTeamGoal = function(newTeamGoal,frID,apiKey,auth){
	jQuery.ajax({
		type: 'POST',
		url: 'https://secure3.convio.net/clientName/site/CRTeamraiserAPI?method=updateTeamInformation&api_key='+apiKey+'&v=1.0&fr_id='+frID+'&team_goal='+newTeamGoal+'&auth='+auth,
		success: function(data){
			console.log('success');
			console.log(data);
		},
		error:function(e){
			console.log('fail');
			console.log(e);
		}
	});
}