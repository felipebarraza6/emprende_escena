
//React 
import React, { useContext, useEffect, useState  } from 'react'

//Antd
import { Layout, Menu, Modal  } from 'antd'

// Antd Icons
import { TeamOutlined, RocketOutlined,  SendOutlined, BankOutlined } from '@ant-design/icons'

//Build
import logo from '../assets/img/white.png'

//Components
import MenuHeader from '../components/home/MenuHeader'
import Modules from './Modules'
import Profile from './Profile'
import Teachers from './Teachers'
import TheJourney from './TheJourney'
import LearningRoute from './LearningRoute'
import { AuthContext } from '../App'
import TestInitial from '../components/home/TestInitial'


// React Router
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'
const { Header, Content, Sider } = Layout


const Home = () =>{

        const { state:auth  } = useContext(AuthContext)
        const [initialTest, setInitialTest] = useState(false)      

        useEffect(()=>{
          if(!auth.user.initial_test_performed){
            setInitialTest(true)
          }
          
        },[])
        
        return(
          <BrowserRouter>
            <Layout style={{ minHeight: '100vh' }}>            
            <Sider width='250px'>
              <div style={{paddingTop:'20px'}}>
                  <img alt='logo' style={styles.logo}  src={logo} />
              </div>
              
              <Menu 
                  theme="dark" 
                  mode="inline"
                  defaultSelectedKeys={['1']}
              >
                <Menu.Item key="1" style={styles.menuItem}  >
                    <Link to="/">
                    <BankOutlined style={styles.icon} />
                    Modulos 
                     </Link>
                </Menu.Item>                 
                <Menu.Item style={styles.menuItem}>
                    <Link to="/teachers">
                      <TeamOutlined style={styles.icon} />
                      Profesores
                    </Link>
                </Menu.Item>
                <Menu.Item style={styles.menuItem}>
                    <Link to="/journey">
                      <SendOutlined rotate={'270'} style={styles.icon}  />
                      El Viaje del Emprendedor
                    </Link>
                </Menu.Item>
                <Menu.Item style={styles.menuItem}>
                    <Link to="/route">
                      <RocketOutlined style={styles.icon}  />
                      Ruta de Aprendizaje
                    </Link>
                </Menu.Item>
              </Menu>
              
            </Sider>

            <Layout>              
            <Header >
              <MenuHeader />
            </Header>
              <Content>
              <div style={styles.content}>
                  {initialTest ? <TestInitial />:
                  <Switch>  
                    <Route exact path='/' component={Modules} />
                    <Route exact path='/profile' component={Profile} />
                    <Route exact path='/teachers' component={Teachers} />
                    <Route exact path='/journey' component={TheJourney} />
                    <Route exact path='/route' component={LearningRoute} />
                 </Switch>}
            </div>
              </Content>              
            </Layout>

          </Layout>
          </BrowserRouter>

                            
        )
    }

const styles = {
  menuItem: {
    marginBottom:'20px'
  },
  icon: {
    marginRight:'5px',
    fontSize:'20px'
  },
  logo: {
    width:'100%',
    marginBottom:'70px'
  },
  content: {
    padding: '20px'
  }
}

export default Home
