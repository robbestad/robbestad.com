# Fifth floor

> Working name for the internal Inmeta app

Available for testing at [heroku](http://fifthfloor.herokuapp.com/)

## TODO

 - Make a ___gulpfile___
 - remove ___boilerplate code___ from the js folder

## Stuff that's done

 - Set up login functionality (with ___stormpath___)
 - Set up nodejs server with ___express 4___
 - Make a ___Heroku-compatible___ setup 
 - NPM init
 - Added the following Heroku config:
 
```
BUILDPACK_URL:            https://github.com/heroku/heroku-buildpack-nodejs
NODE_ENV:                 production
REDISTOGO_URL:            redis://redistogo:26e2de7e309dac4f80efd09a2a28a414@greeneye.redistogo.com:9409/
STORMPATH_API_KEY_ID:     143PTYTV38W23684YZK9GSL5I
STORMPATH_API_KEY_SECRET: kqsGi/Y5Z1dTXiMx4VYF9CMAkKQZ4hH2qAQzmX+7ceE
STORMPATH_SECRET_KEY:     mLxqgzhmFRMKt2g3L2qlpVXDpfFz9lK3gBqs62cLf9DGQHZ4M5v9dk2GtbxMn64g
STORMPATH_URL:            https://api.stormpath.com/v1/applications/33SaF0MLkRQTDTRBNsPEnE
```

## Notes on modules

#### Mailgun
Check out the [source](https://github.com/shz/node-mailgun) for examples. Also, check out the official [Mailgun Docs](http://documentation.mailgun.net/Documentation/DetailedDocsAndAPIReference#Message_Templates) for details.


