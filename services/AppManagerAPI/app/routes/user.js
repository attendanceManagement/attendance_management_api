const passport = require('passport'),
      config = require('@config'),
      models = require('@AppManager/app/setup');
module.exports = (app) => {
  const api = app.AppManagerAPI.app.api.user;
  app.route('/api/v1/setup')
     .post(api.setup(models.User))
  app.route('/api/v1/users')
     .get(passport.authenticate('jwt', config.session),  api.index(models.User, app.get('tokensecret')));
  app.route('/api/v1/users/admin')
      .get(passport.authenticate('jwt', config.session), api.getByQuery(models.User, app.get('tokensecret')))
  app.route('/api/v1/signup')
     .post(api.signup(models.User));
  app.route('/api/v1/user')
    .put(api.edit(models.User));   
}