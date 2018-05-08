require('module-alias/register');
const http = require('http'),
      AppManagerAPI = require('@AppManagerAPI'),
      ApiManagerServer = http.Server(AppManagerAPI),
      ApiManagerPORT = process.env.PORT || 3001,
      LOCAL = '0.0.0.0';
ApiManagerServer.listen(ApiManagerPORT, LOCAL, () => console.log(`AttendanceManagerAPI running on ${ApiManagerPORT}`));