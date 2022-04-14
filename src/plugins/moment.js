import moment from 'moment';

export default {
    install: (app) => {
      // inject a globally available $translate() method
      const momentFunction = (date, format = 'MMMM Do YYYY, h:mm:ss a') => {
        // retrieve a nested property in `options`
        // using `key` as the path
        return moment(date).format(format)
      }
      app.config.globalProperties.$moment = momentFunction

      // const momentFunction = (date, format = "MMMM Do YYYY, h:mm:ss a") => {
      //   if (date) return moment(date).format(format)
      //   else return null
      // };
  
      app.provide("moment", momentFunction);
    }
  }