const cluster = require('cluster');
const numcpus = require('os').cpus().length;
const prompt = require('prompt');

if(cluster.isMaster) {
	// Inputs
	var gridSize = 5000;
	var circleDiameter = 900;
	var n = 1000;
	var iterations = 50;

	// Config
	var worker;
	var workers = {};
	var results = 0;

	// Getting the data from the user
	prompt.start();
	console.log('------------------------------------------------');
	console.log('Enter custom input or hit enter to use default (5000,900,1000,50)');
  	prompt.get(['gridSize', 'circleDiameter', 'n', 'iterations'], function (err, inputs) {
	    if (err) { return onErr(err); }

	    gridSize = inputs.gridSize || gridSize;
	    circleDiameter = inputs.circleDiameter || circleDiameter;
	    n = inputs.n || n;
	    iterations = inputs.iterations || iterations;

    	// If iterations can't be distributed on workers evenly
		if(iterations % numcpus != 0){
			var oddIterations = iterations - (numcpus * Math.floor(iterations/numcpus));
			results += main(gridSize,circleDiameter,n,oddIterations);
			iterations-=oddIterations;
		}

		// Starting workers
		for (let i = 0; i < numcpus; i++) {
			worker = cluster.fork({iterations: iterations/numcpus});
			worker.send({iterations: iterations});
			worker.on('message',function(message){
				console.log(`Worker ${message.pid} returned ${message.result}`);
				results += message.result;
				workers[message.pid] = message.result;
				if(Object.keys(workers).length == numcpus) { // Last worker
					results = results / numcpus;
					console.log('Estimated PI',results);
				}
			});
		}

  	});

} else {
	console.log(`Worker ${process.pid} started`);
	process.on('message',function(message){
		process.send({ pid: process.pid, result: main(5000,900,1000,message.iterations/numcpus) });
	});
}

function main(gridSize,circleDiameter,n,iterations){
	var simulationResults = Array();
	var simulationAvg = 0;
	for(let i = 0; i < iterations; i++){
		var simulationResult = startSimulation(gridSize,circleDiameter,n);
		simulationResults.push(simulationResult);
		simulationAvg+=simulationResult;
	}
	simulationAvg = simulationAvg/iterations;

	return simulationAvg;
}

function startSimulation(gridSize,circleDiameter,n){
	var generateResults = generatePointsAndDistance(gridSize,circleDiameter,n);
	var points = generateResults.points;
	var pointsInCircle = generateResults.pointsInCircle;
	var percentageOfPoints = pointsInCircle/points.length;
	var areaOfCircle = percentageOfPoints*Math.pow(gridSize,2);
	var estimatedPI = areaOfCircle/Math.pow((circleDiameter),2);

	// console.log('points',points);
	// console.log('pointsInCircle:',pointsInCircle);
	// console.log('percentageOfPoints:',(percentageOfPoints*100)+'%');
	// console.log('area of circle by points:',areaOfCircle);
	// console.log('estimated PI:',estimatedPI);
	return estimatedPI;
}


function generatePointsAndDistance(gridSize,circleDiameter,n){
	var points = Array();
	var pointsInCircle = 0;

	for(let i = 0; i < n; i++){
		// Generate Point
		var thisPoint={
			x: Math.floor(Math.random() * gridSize),
			y: Math.floor(Math.random() * gridSize)
		};
		points.push(thisPoint);

		// Calcuate Distance
		if(calculateDistance(thisPoint.x,thisPoint.y,gridSize/2,gridSize/2) < circleDiameter){
			pointsInCircle++;
		}
	}

	return {
		points: points,
		pointsInCircle: pointsInCircle
	};
}

function calculateDistance(x1,y1,x2,y2)
{
	var x = x1 - x2; //calculating number to square in next step
	var y = y1 - y2;
	var dist;

	dist = Math.pow(x, 2) + Math.pow(y, 2);       //calculating Euclidean distance
	dist = Math.round(Math.sqrt(dist));                  

	return dist;
}