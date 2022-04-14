import api from '@/services/api'

export default {
    create(credentials) {
        return api.post('session/create', credentials)
    },
    update(id, credentials) {
        return api.put(`session/update/${id}`, credentials)
    },
    delete (id) {
        return api.delete(`session/delete/${id}`)
    }
}