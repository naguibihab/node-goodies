exports.getResponse = function(req){
	return new Promise(function(fulfill,reject){
		var delay = 200;
		if(req == 2){
			delay = 500;
		}

		setTimeout(function(){
			fulfill({
				status: 200,
				message: req
			});
		},delay);
	});
}