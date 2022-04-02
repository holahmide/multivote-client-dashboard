import Vue from 'vue'
import router from '../router'
import store from '../store'
import api from '@/services/api'
const InterceptAPIRequest = () => {
    // Here because of notifications
api.interceptors.response.use(function(response) {
    return response;
  }, function(err) {
      if (err.response.status == 401 || err.response.status == 419) {
          Vue.toasted.show('Your session as expired!', {
              type: "error",
              theme: "bubble", 
              position: "top-right", 
              duration : 5000,
              action : {
                  text : 'Cancel',
                  onClick : (e, toastObject) => {
                      toastObject.goAway(0);
                  }
              },
          })
          store.commit('LOGOUT_USER')
          router.push({ name : "Login" })
      }
  
      if(err.response.data && err.response.data.data && err.response.data.data.error) {
        let errors = []
        let keys = Object.keys(err.response.data.data.error)
        keys.forEach(key => {
          err.response.data.data.error[key].forEach(error => {
            Vue.notify({
              type: 'error',
              text: error
            })
            errors.push(error)
          })
        })
        err.response.data.errors = errors
      }
      return Promise.reject(err);
  });
}   

export default InterceptAPIRequest;
