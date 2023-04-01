let fs = require('fs');
let readline = require('readline');
let { OAuth2Client } = require('google-auth-library');

let SCOPES = ['https://www.googleapis.com/auth/spreadsheets']; //you can add more scopes according to your permission need. But in case you change the scope, make sure you deleted the ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json file
const TOKEN_DIR = './creds/'; //the directory where we're going to save the token
const TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json'; //the file which will contain the token

class Authentication {
	authenticate() {
		//Runs to get auth to use api
		return new Promise((resolve, reject) => {
			let credentials = this.getClientSecret(); //reads creds file
			let authorizePromise = this.authorize(credentials); //gets the OAuth2Client
			authorizePromise.then(resolve, reject);
		});
	}
	getClientSecret() {
		return require('./creds.json'); //reads creds.json
	}

	authorize(credentials) {
		var clientSecret = credentials.installed.client_secret; //all from creds.json
		var clientId = credentials.installed.client_id;
		var redirectUrl = credentials.installed.redirect_uris[0];

		var oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

		return new Promise((resolve, reject) => {
			// Check if we have previously stored a token.
			fs.readFile(TOKEN_PATH, (err, token) => {
				if (err) {
					//If no file
					this.getNewToken(oauth2Client).then(
						oauth2ClientNew => {
							//Make file with token
							resolve(oauth2ClientNew);
						},
						err => {
							reject(err);
						}
					);
				} else {
					//If file
					oauth2Client.credentials = JSON.parse(token); //credentials is the file we have
					resolve(oauth2Client); //resolve with the JSON of credentials
				}
			});
		});
	}

	getNewToken(oauth2Client, callback) {
		return new Promise((resolve, reject) => {
			var authUrl = oauth2Client.generateAuthUrl({
				//make url to make a new token
				access_type: 'offline',
				scope: SCOPES,
			});
			console.log('Authorize this app by visiting this url: \n ', authUrl);
			var rl = readline.createInterface({
				//allows you to type in console
				input: process.stdin,
				output: process.stdout,
			});

			rl.question('\n\nEnter the code from that page here: ', code => {
				rl.close();
				oauth2Client.getToken(code, (err, token) => {
					//use code to get token
					if (err) {
						console.log('Error while trying to retrieve access token', err);
						reject();
					}
					oauth2Client.credentials = token; //set token
					console.log(token);
					this.storeToken(token); //store token
					resolve(oauth2Client);
				});
			});
		});
	}

	storeToken(token) {
		try {
			fs.mkdirSync(TOKEN_DIR); //make file
		} catch (err) {
			if (err.code != 'EEXIST') {
				throw err;
			}
		}
		fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
			if (err) console.log(err);
			else {
				console.log('Token stored to ' + TOKEN_PATH);
			}
		}); //write file
	}
}

module.exports = new Authentication();
