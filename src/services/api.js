import axios from 'axios'

export default axios.create({
    baseURL: process.env.VUE_APP_BACKEND_REST_URL || `http://127.0.0.1:3000/api/v1`,
    withCredentials : true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})