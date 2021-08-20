const fs = require('fs');
const { ArgumentParser } = require('argparse');
const vanilla = require('puppeteer');
const { addExtra } = require('puppeteer-extra');
const { Cluster } = require('puppeteer-cluster');

global.WORKER = 0;
global.USERS = (fs.readFileSync('accounts.txt', 'utf8')).split('\n');

const parser = new ArgumentParser({ description: "Reddit upvote/downvote raid bot." });
parser.add_argument('-u', '--url', { help: 'Permalink to non-NSFW Reddit post, in quotes. Required.', required: true });
parser.add_argument('-v', '--vote', { help:  'Decide how the bots vote. 0 is down, 1 is up. Default 1.', default: 1 });

global.REDDIT_URL = parser.parse_args()['url'];
global.VOTE = (parseInt(parser.parse_args()['vote']) > 0 ? "up" : "down");

(async() => {

    const Stealth = require('puppeteer-extra-plugin-stealth');
    const puppeteer = addExtra(vanilla);
    puppeteer.use(Stealth());

    const clust = await Cluster.launch({
        puppeteer,
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: USERS.length,
        monitor: true,
        puppeteerOptions: {
            headless: true
        },
        sameDomainDelay: 5000,
        timeout: 86400000
    });

    await clust.on('taskerror', (err, data) => {
        console.log(err.message);
    });

    await clust.task(async ({ page, data: url }) => {

        async function getIDfromFile(id) {
            return USERS[id];
        }

        // login process
        await page.goto(url);
        await page.waitForSelector("#loginUsername");
        await getIDfromFile(WORKER).then(async(i) => {
            await page.type("#loginUsername", i.split(" ")[0], {delay: 100});
            await page.type("#loginPassword", i.split(" ")[1], {delay: 100});
            await page.click("button[type='submit']");
            WORKER++;
        });
        await page.waitForTimeout(10000); // Reddit redirects after login, takes a bit lol

        // and now, the raid
        await page.goto(REDDIT_URL);
        await page.waitForSelector("button[aria-label='"+VOTE+"vote']");
        await page.click("button[aria-label='"+VOTE+"vote']");
        await page.waitForTimeout(1000);

    });

    for(x = 0; x<USERS.length; x++)
        clust.queue("https://www.reddit.com/login/");

    await clust.idle();
    await clust.close();

})();