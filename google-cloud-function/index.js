
// Imports the Google Cloud client library
const PubSub = require(`@google-cloud/pubsub`);

/**
 * Background Cloud Function to be triggered by Pub/Sub.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
exports.helloPubSub = (event, callback) => {
  const pubsubMessage = event.data;
  const name = pubsubMessage.data ? Buffer.from(pubsubMessage.data, 'base64').toString() : 'World';

  console.log(`Hello, ${name}!`);

  callback();
};

/**
 * Background Cloud Function to be triggered by Pub/Sub that does an operation then publishes a topic to another Pub/Sub.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
exports.doStuffThenPubSub = (event, callback) => {
  // Get message from pubsub 1
  const pubsubMessage = event.data;
  const name = pubsubMessage.data ? Buffer.from(pubsubMessage.data, 'base64').toString() : '???';

  console.log(`I got this from, ${name}!`);

  // Forward message to pubsub 2

	// Creates a client
	const pubsub = new PubSub();

	/**
	 * TODO(developer): Uncomment the following lines to run the sample.
	 */
	const topicName = 'naguib-testing-2';
	const data = JSON.stringify({ "sourceTopic": name });

	// Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
	const dataBuffer = Buffer.from(data);

	pubsub
	  .topic(topicName)
	  .publisher()
	  .publish(dataBuffer)
	  .then(results => {
	    const messageId = results[0];
	    console.log(`Message ${messageId} published.`);
	  })
	  .catch(err => {
	    console.error('ERROR:', err);
	  });

  

  callback();
};