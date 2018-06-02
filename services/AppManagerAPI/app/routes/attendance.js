const passport = require('passport'),
      config = require('@config'),
      models = require('@AppManager/app/setup');
module.exports = (app) => {
  const api = app.AppManagerAPI.app.api.attendance;
 
  app.route('/api/v1/attendance')
     .post(passport.authenticate('jwt', config.session),api.store(models.Regularize,models.Attendance,app.get('tokensecret')))
  app.route('/api/v1/attendance')
     .get(passport.authenticate('jwt', config.session), api.getAll(models.User,models.Attendance, app.get('tokensecret')))
     .put(passport.authenticate('jwt', config.session), api.edit(models.User,models.Attendance, app.get('tokensecret')));
  app.route('/api/v1/attendance/checkout')
     .put(passport.authenticate('jwt', config.session), api.checkout(models.User,models.Attendance, app.get('tokensecret')));
  app.route('/api/v1/attendance/employe')
     .get(passport.authenticate('jwt', config.session), api.getByEmp(models.User,models.Attendance, app.get('tokensecret')));

  app.route('/api/v1/attendance/employe/all')
      .get(passport.authenticate('jwt', config.session), api.getAllEmp(models.User,models.Attendance, app.get('tokensecret')));

  app.route('/api/v1/attendance/check')
   .get(passport.authenticate('jwt', config.session), api.checkAttendance(models.Attendance, app.get('tokensecret')))
}