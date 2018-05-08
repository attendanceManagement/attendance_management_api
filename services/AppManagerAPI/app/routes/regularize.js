const passport = require('passport'),
      config = require('@config'),
      models = require('@AppManager/app/setup');
module.exports = (app) => {
    const api = app.AppManagerAPI.app.api.regularize;
    app.route('/api/v1/attendance/regularize')
    .get(passport.authenticate('jwt', config.session),api.getAll(models.Regularize,app.get('tokensecret')))
    app.route('/api/v1/attendance/regularize')
    .post(passport.authenticate('jwt', config.session),api.save(models.Regularize,app.get('tokensecret')))
}