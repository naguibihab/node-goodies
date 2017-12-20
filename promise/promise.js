const myApi = require('./fakeApi.js');

function getResponses(){
	var myRequests = [1,2,3,4];
	var myResponses = {}; // My responses has to be an object otherwise the .length would get messed up
	return new Promise(function(fulfill,reject){
		// I want to store the responses from the serer in myResponses in the same order as myRequests (i.e. myResponses[0] should equal 1)
		myRequests.forEach(function(value,key){
			myApi.getResponse(value).then(function(response){
				console.log(response);
				// Return here should be 1,3,4,2 because 2 is delayed
				myResponses[key] = response;

				// Check if I have all the responses
				if(Object.keys(myResponses).length == 4){
					fulfill(myResponses);
				}
			});
		});
	});
}

getResponses().then(function(result){
	console.log('function result',result);
});