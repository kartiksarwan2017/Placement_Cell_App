const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');
require('dotenv').config();

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

const development = {
    name: "development",
    asset_path:  process.env.PLACEMENT_CELL_ASSET_PATH,
    session_cookie_key: process.env.PLACEMENT_CELL_SESSION_COOKIE_KEY,
    google_client_ID: process.env.PLACEMENT_CELL_GOOGLE_CLIENT_ID,
    google_client_Secret: process.env.PLACEMENT_CELL_DEVELOPMENT_GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.PLACEMENT_CELL_DEVELOPMENT_GOOGLE_CALLBACK_URL,
    github_client_ID: process.env.PLACEMENT_CELL_GITHUB_CLIENT_ID,
    github_client_Secret: process.env.PLACEMENT_CELL_GITHUB_CLIENT_SECRET,
    github_callbackURL: process.env.PLACEMENT_CELL_GITHUB_CALLBACK_URL,
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production = {

    name: "production",
    asset_path: process.env.PLACEMENT_CELL_ASSET_PATH,
    session_cookie_key: process.env.PLACEMENT_CELL_SESSION_COOKIE_KEY,
    google_client_ID: process.env.PLACEMENT_CELL_GOOGLE_CLIENT_ID,
    google_client_Secret: process.env.PLACEMENT_CELL_GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.PLACEMENT_CELL_PRODUCTION_GOOGLE_CALLBACK_URL,
    github_client_ID: process.env.PLACEMENT_CELL_GITHUB_PRODUCTION_CLIENT_ID,
    github_client_Secret: process.env.PLACEMENT_CELL_GITHUB_PRODUCTION_CLIENT_SECRET,
    github_callbackURL: process.env.PLACEMENT_CELL_GITHUB_PRODUCTION_CALLBACK_URL,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }

}

module.exports = eval(process.env.PLACEMENT_CELL_ENVIRONMENT) == undefined ? development : eval(process.env.PLACEMENT_CELL_ENVIRONMENT);