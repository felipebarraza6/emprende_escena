import { POST_LOGIN, GET, POST} from './config'

const finish_course = async(data) => {
  const request = await POST('finish_course/', data)
  return request.data
}

const get_courses = async() => {
  const request = await GET('courses/')
  return request.data

}

const send_initial_test = async(data) => {
  const request = await POST('finish_test/', data)
  return request.data
}

const get_initial_test = async() => {
  const request = await GET('tests/2/')
  return request.data
}

const get_profile = async(user)=> {
  const request = await GET(`users/${user}/`)
  return request.data
}

const login = async (data) => {
  
  const request = await POST_LOGIN('users/login/', {
        email: data.email,
        password: data.password
    })

    return request.data
}

const signup = async(data)=> {
  const request = await POST_LOGIN('users/signup/', {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        dni: data.rut,
        username: data.username,
        password: data.password,
        password_confirmation: data.password_confirmation
    })

    return request.data

}

const api = {
  user: {
    login,
    signup,
    get_initial_test,
    get_profile,
    send_initial_test
  },
  courses: {
    get_courses,
    finish_course
  }

}

export default api
