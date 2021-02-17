
//React 
import React from 'react'

//Antd
import { Layout, Menu  } from 'antd'

// Antd Icons
import { DashboardOutlined, BookOutlined } from '@ant-design/icons'

//Build
import logo from '../assets/img/white.png'

//Components
import MenuHeader from '../complements/home/MenuHeader'
import InitialTest from '../complements/home/InitialTest'
// React Router
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'
import ListCourses from '../complements/home/ListCourses'
const { Header, Content, Sider } = Layout


const Home = () =>{
        
        return(
          <BrowserRouter>
            <Layout style={{ minHeight: '100vh' }}>            
            <Sider style={{padding:'20px'}}>
              <div style={{alignItems:'center'}}>
                  <img alt='logo' style={{width:'90%', marginRight:'50px', marginTop:'40px', marginBottom:'40px'}} src={logo} />
              </div>
              
              <Menu theme="dark" mode="inline">
                <Menu.Item key="1">
                    <Link to="/">
                    <BookOutlined style={{marginRight:'5px'}}/>
                     Escritorio
                     </Link>
                </Menu.Item>                 
              </Menu>
              
            </Sider>

            <Layout>              
            <Header >
              <MenuHeader />
            </Header>
              <Content>
                
                <div style={{ padding: 24, minHeight: 360, textAlign:'left', overflow:'none' }}>
                  <InitialTest />
                  <Switch>  
                    <Route exact path='/' component={ListCourses} />
                 </Switch>
                </div>
                
              </Content>              
            </Layout>

          </Layout>
          </BrowserRouter>

                            
        )
    }


export default Home
