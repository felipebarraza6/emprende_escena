import React,{useEffect, useState, useContext } from 'react'
import { Button , Spin, Tag, Card, Typography, Skeleton } from 'antd';
import { Row, Col} from 'react-flexbox-grid'
import api from '../../api/endpoints'
import { EditOutlined, BookOutlined, CheckSquareFilled } from '@ant-design/icons'

import { ModulesContext } from '../../containers/Modules'
import { AuthContext } from '../../App'

const { Paragraph } = Typography

const ListModules = () => {
  
  const initialState = {
     courses:null,
     loading: true,
     modalCode: false
  }

  const [state, setState] = useState(initialState)
  
  const { dispatch } = useContext(ModulesContext)
  
  const { dispatch:dispatchProfile ,state:profile } = useContext(AuthContext)
  const APPROVED_COURSES = profile.approved_courses

  useEffect(()=>{
    const get_courses_all = async() => {
      const request = await api.courses.get_courses().then((response)=>{
          setState({
            ...state,
            courses: response.results,
            loading: false
          }) 
      })
      const get_profile = await api.user.get_profile(profile.user.username).then((response)=>{
        const access_token = JSON.parse(localStorage.getItem('access_token') || null)
        const user = response.user
        dispatchProfile({
          type:'LOGIN',
          payload:{
            access_token,
            user
          }
        })
      
      })
      return {request, get_profile}
    }
    get_courses_all()
  },[])

  return (
    <>
    {state.loading ?
            <Skeleton active avatar paragraph={{ rows: 20 }} />:
        <Row around='xs'>
          {state.courses.map((obj)=> {
            return(
              <Col key={obj.id}  style={{marginBottom:'20px'}} >
                <Card 
                  key={obj.id}
                  hoverable
                  style={{width:'500px'}}
                  title={obj.title}
                  extra={<Tag color='blue'>{obj.tutor_name}</Tag>}
                  bordered={false}
                  actions={[
                    <>
                    
                    {APPROVED_COURSES.map((approved)=>{
                        const course_id = obj.id
                        const approved_course = approved.course.id

                        if(approved_course === course_id) {
                          return(
                            <Button disabled key={approved.course.id} type='dashed' style={{color:'black'}} >
                              <CheckSquareFilled style={{color:'green', fontSize:'20px'}} />
                              Modulo Completado
                            </Button>
                          )
                        }else {
                          return (
                          <Button 
                          type='primary'
                          onClick={()=>dispatch(
                            {
                              type:'SET_VIEW', 
                              is_retrieve:true, 
                              module:obj, 
                              id_module: obj.id,
                              is_approved: false
                            })}><EditOutlined /> Realizar Modulo</Button>
                          )

                        }
                      })
                    }
                    </>,
                    <>
                    {obj.id >  APPROVED_COURSES.length + 1 &&
                      <Button disabled>No disponible</Button>
                    }
                    {obj.id === APPROVED_COURSES.length + 1 &&
                        <>En progreso <Spin style={{marginLeft:'20px', marginTop:'6px'}} /></>
                    }
                    {APPROVED_COURSES.map((approved)=>{
                      const course_id = obj.id
                      const approved_course = approved.course.id

                      if(approved_course  === course_id){
                        return(
                          <Button 
                            type='primary' 
                            key={approved.course.id}
                            onClick={()=>dispatch(
                              {
                                type:'SET_VIEW', 
                                is_retrieve:true, 
                                module:obj, 
                                id_module:obj.id,
                                is_approved: true
                              })}>
                              <BookOutlined />
                              Ver Contenidos
                          </Button>
                        )
                      }
                    })}
                    </>

                  ]}
                >
                  <Row>
                    <Col sm={8} >
                      <Paragraph>{obj.description}</Paragraph> 
                    </Col>
                  <Col lg style={styles.ColImage}>
                    <img src={obj.image} style={styles.Image} alt={obj.tutor_name} />
                  </Col>
                </Row>
              </Card>
            </Col>
          )
          })}
        </Row>
    }
    </>
  )

}

const styles = {
  Spin:{
  },
  Image: {
    width:'110px',
    border:'3px solid #001529',
    borderRadius:'100%'
  },
  ColImage: {
    marginTop:'-15px'
  }
}


export default ListModules
