const models = require('@AppManager/app/setup');
module.exports = (app) => {
  const api = app.AppManagerAPI.app.api.auth;
  app.route('/')
     .get((req, res) => res.send('Inventory Manager API'));
  app.route('/api/v1/auth')
    .post(api.login(models.User));
}