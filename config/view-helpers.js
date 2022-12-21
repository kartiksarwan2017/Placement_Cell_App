const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {

    app.locals.assetPath = (filePath) => {
        if(env.name == 'development'){
            return filePath;
        }

    }

}