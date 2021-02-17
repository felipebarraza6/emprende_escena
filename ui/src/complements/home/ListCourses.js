import React,{useEffect, useState, useContext} from 'react'
import { Row, Modal,Spin, Card, Button, Checkbox } from 'antd';
import api from '../../api/endpoints'
import ReactPlayer from 'react-player'
import { AuthContext } from '../../App'

const {Meta} = Card

const ListCourses = () => {
  
  const initialState = {
     courses:null,
     loading: true,
     code_verified: null,
     modalCode: false
  }

  const {state:userData} = useContext(AuthContext)
  console.log(userData)
  const [state, setState] = useState(initialState)
  
  const PageOneCourse = (course) => {
    Modal.info({
      title: `${course.title} - ${course.tutor_name}`,
      width: '80%',
      content: <>
        <p>
          {course.description}
        </p>
        {course.videos.map((obj)=> {
            return(
              <>
                <center>
                <ReactPlayer url={obj.url} />
                </center>
              </>
            )
        })}
        <h1>Evaluacion</h1>
        {course.questions.map((question)=> {
            return(
              <>
                <h3>{question.title}</h3>
                {question.alternatives.map((alternative)=> {
                    return(
                          <Checkbox style={{marginLeft:'30px'}}>{alternative.title}</Checkbox>
                    )                  
                })}
              </>
            )                  
        })}
      <div style={{marginTop:'30px'}}>
      <Button onClick={()=> {
        const userref = userData.user.username.slice(0,2)
        const userdnirf = userData.user.dni.slice(0,4)
        const coursecode = course.code_trip
        Modal.info({
          title:'CODIGO VERIFICADOR',
          content:<h1>
            {userref.concat(userdnirf, coursecode)}
          </h1>
        })
        const request = api.courses.finish_course({
          'course': course.id,
          'user': userData.user.id,
          'code_travel': userref.concat(userdnirf, coursecode)
        }) 
            
      }} type='primary'>Enviar Respuestas</Button>
      </div>
      </>
    })

  }

  useEffect(()=>{
    const get_courses_all = async() => {
      const request = await api.courses.get_courses().then((response)=>{
          setState({
            ...state,
            courses: response.results,
            loading: false
          }) 
      })
    }
    get_courses_all()
  },[])

  return (
    <>
    {state.loading ?
          <Spin />:
      <>
      <Modal visible={state.modalCode} onOk={()=>setState({...state, modalCode: false})}  title='CODIGO VERIFICADOR'>
        
      </Modal>
      <Row>
        {state.courses.map((obj)=> {
          return(
            <div style={{margin:'20px'}}>
              <Card 
                hoverable
                style={{width:240}}
                cover={<img alt={obj.title} src={obj.image} />}
              >
              <Meta title={obj.title} description={<Button onClick={()=>PageOneCourse(obj)}  type='primary'>Realizar Curso</Button>} />
              </Card>
            </div>
          )
          })}
        </Row>
      </>
    }
    </>
  )

}


export default ListCourses
