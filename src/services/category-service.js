import api from '@/services/api'

export default {
    create(credentials) {
        return api.post('session/category/create', credentials)
    },
    update(id, credentials) {
        return api.put(`session/category/update/${id}`, credentials)
    },
    delete (id) {
        return api.delete(`session/category/delete/${id}`)
    }
}