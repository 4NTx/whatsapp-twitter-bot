import Twit from 'twit';
import config from 'config';

const twitterConfig = config.get('Twitter');

const twitterClient = new Twit({
    consumer_key: twitterConfig.consumer_key,
    consumer_secret: twitterConfig.consumer_secret,
    access_token: twitterConfig.access_token,
    access_token_secret: twitterConfig.access_token_secret
});

export default twitterClient;
