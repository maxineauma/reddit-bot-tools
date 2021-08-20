const snoowrap = require('snoowrap');
const config = require('./config');

const r = new snoowrap(config.credentials);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// refresh: 26289891222-RCUilt777ODQ6NG1Hfi8WqQ9jEwBqQ
// access: 26289891222-Za8jPlMnImpPRzkiEK-5M4XfnaAFRg

(async() => {

    await r.getSubreddit(config.post.subreddit).submitLink({
        title: config.post.title,
        url: config.post.url
    }).then(res => {
        global.POST = res.name;
        console.log("New post titled '"+config.post.title+"' at r/"+config.post.subreddit+"/" + res.name + ".");
    });

    while(await r.getSubmission(POST).score < config.post.threshold) {
        console.log("Current score: " + await r.getSubmission(POST).score + ". Less than threshold of "+config.post.threshold+", waiting 2 minutes...");
        await sleep(60000 * 2); // 2 min
    }

    r.getSubmission(POST).downvote();
    console.log("Upvote retracted! Ending process.")

})();