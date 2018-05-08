const passport = require('passport'),
      config = require('@config'),
      models = require('@AppManager/app/setup');
module.exports = (app) => {
    const api = app.AppManagerAPI.app.api.leave;
    app.route('/api/v1/attendance/leave')
    .get(passport.authenticate('jwt', config.session),api.getAll(models.Leave,app.get('tokensecret')))
    .post(passport.authenticate('jwt', config.session),api.save(models.Leave,models.User,app.get('tokensecret')))
    .put(passport.authenticate('jwt', config.session),api.edit(models.Leave,models.User,app.get('tokensecret')));
     app.route('/api/v1/attendance/leave/approve')
       .post(passport.authenticate('jwt', config.session),api.approve(models.Leave,models.User,models.Attendance,app.get('tokensecret')));
     app.route('/api/v1/attendance/leave/team')
     .get(passport.authenticate('jwt', config.session),api.getTeamLeave(models.Team,models.Leave,app.get('tokensecret')))
}