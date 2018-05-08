Hi this is readme for attendance management API.

added attendance api

to use in vue


   Axios.put(`${apiURL}/api/v1/attendance/checkout`, {
          headers: { 'Authorization': Authentication.getAuthenticationHeader(this) },
          params: {
            emp_id: this.$cookie.get('emp_id'),            
          }
        }).then(.......
  
