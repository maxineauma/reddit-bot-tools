# Reddit Bot Tools
---------
This is a pair of tools used for autoposting and vote targeting on Reddit.
You will find:
1. `raid.js` -- used to target a post (not a comment) with up/down votes via your accounts specified in `accounts.txt`.
2. `autopost.js` -- creates a post with credentials specified in `config.js`, waits until it meets a certain score threshold, and retracts its own upvote.

###### Prerequisite Packages
Please install prerequisites with `npm install` before attempting to run any of these programs.
In your preferred text editor, you will also need to edit `config.js`. In order to set this program up:
1. You will need to create a *script* application at https://www.reddit.com/prefs/apps. When it is complete, click **edit**.
2. Copy the string under "personal use script" and copy the string next to "secret". Make note of these tokens.
3. Go to the [Reddit OAuth Helper](https://not-an-aardvark.github.io/reddit-oauth-helper/) and enter your Client ID and Client Secret (the above tokens).
4. Make sure to check the "Permanent?" box, as well as the box to the left of "Scope name". Scroll to the bottom and press "Generate tokens".
5. Reddit will open a request for permission page,  make sure the following permissions are available: Submit links, submit and change my votes. Press allow.
6. The OAuth Helper will open again, and will show you both your refresh token and access token. Copy these both, make note of your refresh token.
7. In `config.js`, set the following (inside the empty quotes):
    * `config.credentials.userAgent` to whatever you'd like.
    * `config.credentials.clientId` to your Client ID that you noted earlier.
    * `config.credentials.clientSecret` to your Client Secret that you noted earlier.
    * `config.credentials.refreshToken` to your refresh token you obtained from the OAuth helper.
    * `config.post.subreddit` to the subreddit you're posting in.
    * `config.post.title` to the title of your post.
    * `config.post.url` to the link your post redirects to.
    * `config.post.threshold` to the maximum score before the bot retracts its upvote automatically to end the process.
8. Add your accounts to `accounts.txt` (create it if it doesn't exist). Each account should be on a new line. 
    * Formatted as such: `Username(space)Password`. 

## Usage 
* `node raid.js [-h] -u URL [-v VOTE]`
* **Output**:
```
optional arguments:
  -h, --help            show this help message and exit
  -u URL, --url URL     Permalink to non-NSFW Reddit post, in quotes. Required.
  -v VOTE, --vote VOTE  Decide how the bots vote. 0 is down, 1 is up. Default 1.
```

* `node autopost.js`