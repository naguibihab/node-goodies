# Google Cloud Functions

Here we have two functions that are working off two pubsubs. Pubsub1 triggers doStuffThenPubSub which publishes to Pubsub2 which triggers helloPubSub

Pubsub1 --> doStuffThenPubSub() --> Pubsub2 --> helloPubSub()

To deploy the function:

`gcloud beta functions deploy helloPubSub --trigger-resource my-topic --trigger-event google.pubsub.topic.publish`