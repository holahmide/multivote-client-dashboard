import api from '@/services/api'

export default {
    createMultiple(credentials) {
        return api.post('session/category/nominee/create/multiple', credentials)
    },
    update(id, credentials) {
        return api.put(`session/category/nominee/update/${id}`, credentials)
    },
    delete (id) {
        return api.delete(`session/category/nominee/delete/${id}`)
    }
}