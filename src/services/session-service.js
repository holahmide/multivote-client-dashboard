import api from '@/services/api'

export default {
    create(credentials) {
        return api.post('session/create', credentials)
    },
    login(credentials) {
        return api.post(`auth/login`, credentials).then(response => {
            if (response.data.accessToken) {
              localStorage.setItem('user', JSON.stringify(response.data));
            }
    
            return response.data;
          });
    },
    getUser () {
        return api.get('auth/status')
    },
    logout() {
        return api.get('auth/logout')
    },

    update (credentials, id) {
        return api.put(`auth/update/${id}`, credentials)
    },

    get_roles_and_permissions () {
        return api.get('roles_and_permissions')
    },
    create_role (payload) {
        return api.post(`roles/store`, payload)
    },
    update_role (payload, id) {
        return api.post(`roles/update/${id}`, payload)
    },
    delete_role (id) {
        return api.delete(`roles/${id}`)
    },
    create_permission (payload) {
        return api.post(`permissions/store`, payload)
    },
    update_permission (payload, id) {
        return api.post(`permissions/update/${id}`, payload)
    },
    delete_permission (id) {
        return api.delete(`permissions/${id}`)
    },
    get_user_roles_and_permissions (id) {
        return api.get(`user/roles_and_permissions/${id}`)
    },
    set_user_roles_and_permissions (payload, id) {
        console.log(payload.roles)
        return api.post(`user/roles_and_permissions/${id}`, payload)
    }
}