import React, { useContext }  from 'react' 

import { Menu } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
 
//Auth Context
import { AuthContext } from '../../App'


const MenuHeader = () =>{   

    const rightStyle = {position: 'absolute', top: 0, right: 0}    

    const { dispatch, state } = useContext(AuthContext)

    const Logout = () => dispatch({
            type: 'LOGOUT'
    })

    return (                
            <Menu mode="horizontal" theme="dark" style={rightStyle}>
                <Menu.Item>
                  RUT: {state.user.dni}
                </Menu.Item>
                <Menu.Item onClick={Logout}>
                    <LogoutOutlined />
                    Cerrar Sesión
                </Menu.Item>
            </Menu>                
    )

}

export default MenuHeader
