# Google Cloud Functions

A google cloud function triggered by a pub/sub topic

Following (this tutorial)[https://cloud.google.com/functions/docs/tutorials/pubsub#windows] to create this function

To deploy the function:

`gcloud beta functions deploy helloPubSub --trigger-resource my-topic --trigger-event google.pubsub.topic.publish`