let kafka = require('kafka-node');

function ConnectionProvider() {
    this.getConsumer = function (topic_name) {
        if (!this.kafkaConsumerConnection) {

            this.client = new kafka.Client("localhost:2181");
            this.kafkaConsumerConnection = new kafka.Consumer(
                                              this.client,
                                              [{topic: topic_name, partition: 0}]
                                          );

            this.client.on('ready', function () {
                console.log('client ready from express with topic: ' + topic_name)
            })
        }
        return this.kafkaConsumerConnection;
    };

    //Code will be executed when we start Producer
    this.getProducer = function () {
        if (!this.kafkaProducerConnection) {
            this.client = new kafka.Client("localhost:2181");
            let HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            //this.kafkaConnection = new kafka.Producer(this.client);
            console.log('kafka express producer ready');
        }
        return this.kafkaProducerConnection;
    };
}

exports = module.exports = new ConnectionProvider;
