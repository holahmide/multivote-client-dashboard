import api from '@/services/api'

export default {
    register(credentials) {
        return api.post('user/super/register', credentials)
    },
    login(credentials) {
        return api.post(`auth/super/login`, credentials).then(response => {
            if (response.data.accessToken) {
              localStorage.setItem('user', JSON.stringify(response.data));
            }
    
            return response.data;
          });
    },
    getUser () {
        return api.get('auth/super/status')
    },
    logout() {
        return api.get('auth/super/logout')
    },

    update (credentials) {
        return api.put(`user/update`, credentials)
    },

    change_password (credentials) {
        return api.post(`user/change-password`, credentials)
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
        return api.post(`user/roles_and_permissions/${id}`, payload)
    }
}