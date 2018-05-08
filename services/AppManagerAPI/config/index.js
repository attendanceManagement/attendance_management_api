module.exports = {
  secret: 'saikala_attendence',
  session: { session: false },
  database: process.env.MONGODB ||'mongodb://localhost/attendanceManager'
}