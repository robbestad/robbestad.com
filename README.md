# Robbestad.com

> Completely reactified

> Uses react-router

> Applies the Flux architecture

> All data are pulled from an API and stored in a single store on load

Check out [the site](http://www.robbestad.com/)

## Workflow

npm start (for development)
This set up the build environment and starts a webserver at http://localhost:3000
When changes are made in the __scss__ or __js__ files, the bundles are automatically
recompiled. 

This project is built with regards for deployment on Heroku. Issue __git push heroku master__ for
deployment.

For deployment on a standard node server, simply build with __npm build__ and start the server with
__node index.js__.

## TODO

 - Write more ___articles___
 - Make a prettier landing page
 - 
## Stuff that's done

 - Set up nodejs server with ___express 4___
 - Configged package.json & gulpfile.js
 - Make a ___Heroku-compatible___ setup 
 - Added the following Heroku config:
 
```
BUILDPACK_URL:            https://github.com/heroku/heroku-buildpack-nodejs
NODE_ENV:                 production
```

