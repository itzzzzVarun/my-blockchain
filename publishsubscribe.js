const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST'
}

class PubSub {
    constructor() {
        this.publish = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscriber.subscriber(CHANNELS.TEST)
    }
}