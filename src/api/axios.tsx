import axios from 'axios';
const bearer:string = localStorage.getItem('token') || ''

if(!localStorage.getItem('token')) {
    localStorage.setItem('token', '');
}

const api = axios.create({
    baseURL: 'your-base-url'
})
api.defaults.headers.common['Content-type'] = 'applicaton/json'
api.defaults.headers.common['Authorization'] = `Bearer ${bearer}`

const refApi = {
    method: 'POST',
    url: 'your-api-token',
    headers: {'Content-Type': 'application/json'},
    data: {
        refreshToken: '059c420e-7424-431f-b23b-af0ecabfe7b8',
        teamId: 'a001994b-918b-4939-8518-3377732e4e88'
    }
}

const getContacts = async (nextPage = '', minMessagesSent=0, minMessagesRecv=0, maxMessagesSent=0, maxMessagesRecv=0, q='', tags='', options={}) => {
    const response= await api.get(`/contacts?page=${nextPage}&minMessagesSent=${minMessagesSent}&minMessagesRecv=${minMessagesRecv}&maxMessagesSent=${maxMessagesSent}&maxMessagesRecv=${maxMessagesRecv}&q=${q}`, options)
    return response.data
}

const refreshToken = async () => {
    try {
        const { data } = await axios.request(refApi);
        localStorage.setItem('token', data.access_token);
        return data
    } catch (error) {
        return console.error(error);
    }
}

export {
    getContacts,
    refreshToken
}