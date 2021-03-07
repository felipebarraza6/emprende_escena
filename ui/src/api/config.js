import axios from 'axios'


const BASE_URL = 'https://api.emprendescena.cl'

export const INSTANCE_OAUTH2 = axios.request({
    headers: { 
        "Content-Type":"application/x-www-form-urlencoded;charset:UTF-8",
        "Access-Control-Allow-Origin": "https://api.emprendescena.cl/",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Request-Method": "POST, GET",
        "Access-Control-Allow-Methods" : "POST, GET"
    }, 
    url: "api/oauth/token/",
    method: "post",    
    baseURL: "https://apitest.corfo.cl:9101/",
    data: {
      "grant_type": "client_credentials",
      "scope": "resource.READ",
      "client_id": '5d652985-93b7-407c-9365-05d7d83e629d',
      "client_secret": 'a6fa2019-0b05-4145-8d73-20478cd4f52b'    
    }
  }).then(function(res) {
    console.log(res);  
  }).catch(function (error){
      console.log({error})
  })

export const INSTANCE = axios.create({
    baseURL: BASE_URL,
})

export const POST_LOGIN = async (endpoint ,data) =>{

    const request = await INSTANCE.post(endpoint, data)

    return request
}

export const GET = async (endpoint) =>{

    const token = JSON.parse(localStorage.getItem('access_token') || null)
    const options = {
        headers: {
            Authorization: `Token ${token}`
        }
    }
    const response = await INSTANCE.get(endpoint, options)

    return response
}

export const POST = async (endpoint, data) =>{

    const token = JSON.parse(localStorage.getItem('access_token') || null)

    const options = {
        headers: {
            Authorization: `Token ${token}`
        }
    }

    const response = INSTANCE.post(endpoint, data, options)

    return response
}

