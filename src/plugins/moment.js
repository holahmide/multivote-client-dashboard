import moment from 'moment';
export default {
    install: (app) => {
      // inject a globally available $translate() method
      app.config.globalProperties.$moment = (date) => {
        // retrieve a nested property in `options`
        // using `key` as the path
        return moment(date).format('MMMM Do YYYY, h:mm:ss a')
      }
    }
  }