import React, {useEffect,useReducer} from 'react'

import {login_reducer} from './reducers/auth'
import api from '../src/api/endpoints'
import './App.css'

import Home from './containers/Home'
import Login from './containers/Login'
import {INSTANCE_OAUTH2} from './api/config'

export const AuthContext = React.createContext()

const initialState = {
  isAuthenticated: false,
  access_token: null,
  user: null,
  approved_courses: null
}


function App() {
  
  const [state, dispatch] = useReducer(login_reducer, initialState) 

  useEffect(()=> {
    
    const access_token = JSON.parse(localStorage.getItem('access_token') || null)  
    const user = JSON.parse(localStorage.getItem('user') || null)

    async function get_user(user){
      const request = await api.user.get_profile(user).then((response)=> {
          <INSTANCE_OAUTH2 />
          const access_token = JSON.parse(localStorage.getItem('access_token') || null)
          const user = response.user 
          dispatch({
            type:'LOGIN',
            payload: {
              access_token,
              user
            }
          })
      })
      return request
    }

    if(user && access_token){
      get_user(user.username)
    }
  },[])


  return (
    <AuthContext.Provider
      value = {{
        state,
        dispatch
      }}
    >
      {state.isAuthenticated ?
        <Home />:
        <Login />

      }
    </AuthContext.Provider>
  )
}


export default App
