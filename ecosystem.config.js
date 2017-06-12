module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'AddressBook',
      script    : 'address-book.js',
			"watch"   : true,
			"ignore_watch" : [ ".git", "node_modules", "public/src", "data" ],
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ]

};
