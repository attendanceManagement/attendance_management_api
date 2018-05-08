const passport = require('passport'),
      config = require('@config'),
      models = require('@AppManager/app/setup');
module.exports = (app) => {
  const api = app.AppManagerAPI.app.api.team; 
app.route('/api/v1/manage/team')
    .post(passport.authenticate('jwt', config.session),api.save(models.Team,app.get('tokensecret')))
    .get(passport.authenticate('jwt', config.session),api.get(models.Team,app.get('tokensecret')))
    .put(passport.authenticate('jwt', config.session),api.edit(models.Team,app.get('tokensecret')))
app.route('/api/v1/manage/team/members')
.get(passport.authenticate('jwt', config.session),api.members(models.Team,models.User,app.get('tokensecret')))
app.route('/api/v1/team/regularize')
.get(passport.authenticate('jwt', config.session),api.getRegularize(models.Team,app.get('tokensecret')))
}