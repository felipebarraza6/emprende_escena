import React, { useState, useEffect, useContext } from 'react'
import { Tag, Timeline, Skeleton, Row, Col } from 'antd'
import {AuthContext} from '../App'
import api from '../api/endpoints'

const LearningRoute = () => {

  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(false)
  const { state:auth } = useContext(AuthContext)
  const approved = auth.approved_courses

  useEffect(()=> {
       async function get_modules(){
      
      setLoading(true)

      const request = await api.courses.get_courses().then((response)=> {

        setModules(response.results)
        setLoading(false)
      })
      
    }

    get_modules()

  },[])

  return(
    <Row align='middle' justify='space-around'>
    {loading ? <Skeleton/ >:
    <Col style={{marginTop:'10%'}}>
    <Timeline>
      {modules.map((module)=> {
        var color= 'red'
        var aproved_course  = false
        var date_aprovedd = ''
        var code = ''
        if(approved.length > 0){
          approved.map((module_approved)=> {
            if(module_approved.course.id===module.id){
              console.log(module_approved.created)
              date_aprovedd = module_approved.created.slice(0,10)
              aproved_course = true
              color='green'
              code = module_approved.code_travel
            }
            
          })
        }

        return(
          <Timeline.Item color={color}  key={module.id}>{module.title} {aproved_course && <><Tag>{date_aprovedd}</Tag><Tag color='green'>{code}</Tag></> } </Timeline.Item>
        )

      })}
    </Timeline>
    </Col>
    }
    </Row>
  )

}


export default LearningRoute
