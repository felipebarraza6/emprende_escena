import React, { useState, useEffect } from 'react'
import { Button, Row, Col, notification, Spin, Form, Typography, Select } from 'antd'
import api from '../../api/endpoints'
const { Option } = Select
const { Title, Paragraph } = Typography
const TestInitial = () => {
  
  const [loading, setLoading] = useState(false)
  const [test, setTest] = useState()

  useEffect(()=> {

    async function get_questions(){
      
      setLoading(true) 

      const request = await api.user.get_initial_test().then((response)=>{
        setTest({...response})
        setLoading(false)
      })
    }
    
    get_questions()

  },[])

  const postValues = (values) => {
    
    const answers =[]

    for(const [key, value] of Object.entries(values)){
      answers.push({'question':key, 'answer':value})
    }

    const request = api.user.send_initial_test(answers).then((response)=> {
        notification.success({
          message: 'Completado!',
          description: `Test inicial completado, disfruta de nuestra plataforma!`
        })
      window.location.reload()
    })
  }

  return(
    <>
    {loading ? <Row style={{padding:'50px'}}><Spin size='large' /></Row>:
        <>
          {test && 
            <>
            <Row align='center'>
              <Col span={12}>
              <Title style={{textAlign:'center'}} level={3}>{test.title}</Title>
              <Paragraph style={{textAlign:'center',marginBottom:'30px'}} strong={true}>{test.description}</Paragraph>
              </Col>
            </Row>
            <Row align='center'>
                <Form onFinish={postValues}  layout='vertical' name='testInitial'>
                  {test.questions.map((question)=>
                    <Col span={24} >
                    <Form.Item name={question.id} label={question.title} rules={[{required:true, message:'Debes seleccionar una respuesta'}]}  >
                      <Select placeholder='Selecciona una optiones' >
                        {question.alternatives.map((alternative)=>
                          <Option value={alternative.id}>{alternative.title}</Option>
                        )}
                      </Select>
                    </Form.Item>
                    </Col>
                  )}
                  <Button type='primary' htmlType='submit' size='large' block  >ENVIAR RESPUESTAS</Button>
                </Form>
            </Row>
            </>
          }
        </>

      }
    </>
  )
  
}


export default TestInitial
