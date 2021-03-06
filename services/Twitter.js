const twitterModule = require("twit");
const { formatTweet } = require('../helpers/tweet-formater')

class Twitter {
  constructor(credential) {
    if (!credential) throw new Error("No credentials provide");
    this.client = new twitterModule(credential);
  }
}

class TwitterStream extends Twitter {
  constructor(credential) {
    super(credential);
  }

  /**
   * @description search for most recently twits
   * @param {number} twitsQty number of twitts to get
   * @param {string} searchKey search key for twits
   */
  async getRecentTweets(twitsQty, searchKey) {
    try {
      let tweetArray = [];
      const { data } = await this.client.get("search/tweets", { q: searchKey, count: twitsQty });
      if (data && data.statuses.length > 0) {
        tweetArray = data.statuses.map((tweet) => formatTweet(tweet));
        return tweetArray
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * @description get stream of tweets
   * @param {string} searchKey search key for twits
   */
  tweetStream(searchKey) {
    const stream = this.client.stream("statuses/filter", {
      track: searchKey
    });
    return stream;
  }
}

module.exports = TwitterStream;
