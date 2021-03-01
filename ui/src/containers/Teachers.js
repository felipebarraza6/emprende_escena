import React,{ useState, useEffect } from 'react'
import api from '../api/endpoints'
import { Skeleton, Typography, Row, Col, Card, Button, Modal  } from 'antd'
const { Title, Paragraph } = Typography
const Teachers = () => {

  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(false)

  function showModal(module){
  
    Modal.info({
      title:`${module.tutor_name}`,
      content: (
        <Paragraph style={{textAlign:'justify', paddingRight:'10px'}}>
          {module.tutor_text}
        </Paragraph>
      ),
      width:'500px'
    })

  }
  
  useEffect(()=> {
  
    async function get_modules(){
      setLoading(true) 
      const request = await api.courses.get_courses().then((response)=> {
        setLoading(false)
        setModules(response.results)

      })
    
    }

    get_modules()

  }, [])

  return(
    <Row>
        {loading ? <Skeleton active  paragraph={{ rows: 30 }} /> :
          <>
            {modules.map((module)=> {
              
              return(
                <Col span={6} style={{padding:'5px'}}>
                  <Card  extra={<img style={{marginLeft:'20%'}} src={module.image} width={'60%'} alt={module.id} />}>
                    <Title level={5}>{module.tutor_name}</Title>
                    <Button style={{marginLeft:'50%'}} onClick={()=>showModal(module)}  type='primary'>Ver Biografia</Button>
                  </Card>
                </Col>
              )

            })}
          </>
        }
    </Row>
  )

}

export default Teachers
