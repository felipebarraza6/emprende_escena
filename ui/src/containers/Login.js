import React from 'react'

import { Form, Input, Button, Checkbox, Spin, message, notification } from 'antd';

import { UserOutlined, LockOutlined } from '@ant-design/icons'

import { AuthContext } from '../App'
import { validate, clean, format, getCheckDigit} from 'rut.js'
import logo from '../assets/img/white.png'

import '../assets/css/login.css'

import api from '../api/endpoints'


const Login = () => {   
    const { dispatch } = React.useContext(AuthContext)
    const [form] = Form.useForm();
    const [statusRut, setStatusRut] = React.useState(false)
    const [errors, setErrors] = React.useState(null)
    const [isPassport, setIsPassport] = React.useState(false)
    const initialState = {
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",        
        password_confirmation: "",
        isSubmitting: false,
        errorMessage: null,
        user:null,
        createUser: false
    }

    const [data, setData] = React.useState(initialState)
    

    const handleInputChange = e => {        
      if(e.target.name==='rut'){
          console.log()
      }
        setData({
            ...data,
            [e.target.name]: e.target.value            
        })        
    }
    
    const handleFormSubmit = async(formData) => {        

        if(data.createUser){
          var passwd = formData.password
          var passwd_val = formData.password_confirmation
          if (passwd !== passwd_val){
            message.warning('Las contraseñas no coinciden!')
          }else {
            
            setData({
              ...data,
              isSubmitting:true,
              errorMessage:null
            })
              const request = await api.user.signup(formData).then((response=>{
              setData({
                ...data,
                isSubmitting: false,
                errorMessage: null,
                createUser: false
              })
              message.info(`Usuario creado: ${response.email}`)

            })).catch((error)=> {
              var errors = error.response.data
              setData({
                ...data,
                isSubmitting:false,
                errorMessage: error.response.data,                
              })


                Object.keys(errors).map((key, index)=> {                  
                    let field = key
                    let message = errors[key]
                  if(key==='non_field_errors'){
                    field='Error'
                  }
                    notification.error({message:`${field}: ${message}`})
                })
              

              

              message.error('Error al crear usuario!')
            })
            return request

          }
        }else{
          setData({
            ...data,
            isSubmitting:true
          })
          const request = await api.user.login(formData).then((response)=>{
            setData({
              isSubmitting:false,
              errorMessage:null,
              createUser:false
            })
            dispatch({
              type: 'LOGIN',
              payload: response
            })
          }).catch((error)=>{
            message.warning('Error al iniciar sesion')
            setData({
              ...data,
              isSubmitting:false
            })
          })
          return request
         
        }
        }
        
   return(
        <div className="general-login">
          <div className="login-container">
            <img src={logo} alt='logo' />
            <div className="login">
              <Form
                onFinish = { handleFormSubmit }
                name="normal_login"
                className="login-form"       
                layout='vertical'         
              >
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Ingresa tu correo corporativo', type: 'email', message: 'Seguro que es un correo?'}]}
                >
                  <Input 
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    type="email" 
                    placeholder="Email" 
                    value={data.email}
                    name="email"                    
                    onChange={handleInputChange}                                       
                  />
                </Form.Item>
                {data.createUser &&
                  <>
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Ingresa tu nombre de usuaio'}]}
                  >
                    <Input 
                      type='text'
                      placeholder='Usuario'
                      value={data.username}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name='first_name'
                    rules={[{ required: true, message: 'Ingresa tu nombre'}]}
                  >
                    <Input
                      type='text'
                      placeholder='Nombre'
                      value={data.first_name}
                      name='first_name'
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name='last_name'
                    rules={[{ required: true, message: 'Ingresa tu apellido'}]}
                  >
                    <Input 
                      type='text'
                      placeholder='Apellido'
                      name='last_name'
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                 
                    Utilizaras pasaporte? <Checkbox checked={isPassport} onChange={(e)=>{
                        setIsPassport(e.target.checked)
                        if(e.target.checked === true) {
                          setStatusRut(false)
                        }
                      }}   />                 
                    {isPassport ?    
                    <Form.Item
                    name='rut'
                    rules={[{ required: true, message: 'Debes completas este campo'}, {min:8, message:'Debes ingresar 8 digitos como minimo'}]}                                 
                    validateStatus={statusRut ? 'error' : 'success' }                                        
                  >
                    <Input 
                    type='text'                      
                    placeholder='Ingresa tu pasaporte'                      
                    name='rut'                    
                    
                    
                  /></Form.Item>:
                  <Form.Item
                  name='rut'
                  rules={[{ required: true, message: 'Debes completas este campo'}, {min:8, message:'Debes ingresar 8 digitos como minimo'}]}                                 
                  validateStatus={statusRut ? 'error' : 'success' }       
                  label="Agrega el (-) antes de tu digíto verificador"             
                >
                    <Input 
                      type='text'                      
                      placeholder='Rut (ej: 9876543-1)'                      
                      name='rut'
                      onError={true}                      
                      onBlur={(e)=>{                          
                          if(validate(e.target.value)){                                                                      
                              setData({
                                ...data,
                                [e.target.name]: format(e.target.value)                                
                              })                                                        
                              setStatusRut(false)
                              message.success('Rut correcto')
                          }else{
                              setStatusRut(true)
                              message.error('Rut Incorrecto')
                          }
                        }}
                    />
                    </Form.Item>
                  }                  
                  </>
                }
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Ingresa tu contraseña!' },
                    { min:8, message: 'Tu contraseña debe tener al menos 8 caracteres.' },
                    { max:16, message: 'Tu contraseña no debe tener más de 16 caracteres.' }
                  ]}
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Contraseña"
                    value={data.password}
                    name="password"                    
                    onChange={handleInputChange}

                  />
                </Form.Item>
               {data.createUser && 
                  <Form.Item
                    name="password_confirmation"
                    rules={[
                      { required: true, message: 'Ingresa tu contraseña de confirmacion!' },
                      { min:8, message: 'Tu contraseña debe tener al menos 8 caracteres.' },
                      { max:16, message: 'Tu contraseña no debe tener más de 16 caracteres.' }
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Confirmacion de contraseña"
                      value={data.password_confirmation}
                      name="password_confirmation"
                      onChange = {handleInputChange}
                    />
                  </Form.Item>
               }
                <Form.Item>
                  {data.isSubmitting ? <Spin />
                    : <Button type="primary" htmlType="submit" className="login-form-button">Aceptar</Button>}
                  {data.createUser === false ?
                      <Button onClick={()=> setData({ ...data, createUser:true})}  style={{marginLeft:'20px'}}>Crear Usuario</Button>:
                      <Button danger  onClick={()=> setData({ ...data, createUser:false})}  style={{marginLeft:'20px'}}>Cancelar</Button>
                  }
                </Form.Item>
              </Form>
            </div>
              <p style={{color:'white'}}>2021 - Emprende Escena</p>
          </div>
        </div>
    )
}

export default Login
