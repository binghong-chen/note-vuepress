# PubSubJS

```js
import PubSub from 'pubsub-js'

// or when using CommonJS
const PubSub = require('pubsub-js')

// Basic example
// create a function to subscribe to topics
var mySubscriber = function(msg, data) {
  console.log(msg, data)
}

// add the function to the list of subscribers for a particular topic
// we're keeping the returned token, in order to be able to unsubscribe
// from the topic later on
var token = PubSub.subscribe('MY TOPIC', mySubscriber)

// publish a topic asynchronously
PubSub.publish('MY TOPIC', 'hello world!')

// publish a topic synchronously, which is faster in some environments,
// but will get confusing when one topic triggers new topics in the 
// same execution chain
// USE WITH CAUTION, HERE BE DRAGONS!!!
PubSub.publishSync('MY TOPIC', 'hello world!')
```

