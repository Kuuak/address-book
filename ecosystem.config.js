const path = require( 'path' );

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'AddressBook',
      script    : path.resolve( __dirname, 'address-book.js' ),
			"watch"   : true,
			"ignore_watch" : [ path.resolve( __dirname, ".git" ), path.resolve( __dirname, "node_modules" ), path.resolve( __dirname, "public/src" ), path.resolve( __dirname, "data" ) ],
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ]

};
