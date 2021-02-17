import React, {useState, useEffect, useContext} from 'react'

import api from '../../api/endpoints'

import { Row, Col, Card, Modal,Statistic ,Typography, Button, Form } from 'antd'

import { AuthContext } from '../../App'
import Checkbox from 'antd/lib/checkbox/Checkbox'

export const TestInitialContext = React.createContext()

const InitialTest = () => {
  
  const initialState = {
    is_valid: false,
    data: null,
    count_finish_modules: 0,
    count_total_courses: 0
  }
  
  const { dispatch, state } = useContext(AuthContext)

  
  const [stateTest, setTest] = useState(initialState) 

  const ModalTest = (test=stateTest.data)=> {
    Modal.success({
      title: test.title,
      onOk: async ()=>{
        const request = await api.user.send_initial_test({
          'user': state.user.id,
          'test': 2
        }).then((response)=> {
          setTest({...stateTest, is_valid:true})
          
        })
      },
      content:  <>
        <Form>
          {test.questions.map((obj)=>
            
            <>
              <h2>
                 {obj.title}
              </h2>
              
              {obj.alternatives.map((obj)=><><Checkbox>{obj.title}</Checkbox></>)}
            </>
          
          )}
       </Form>

      </>  }) 
  }
    
  useEffect(()=> {
      const  get_data_profile =  async () => {
        const validation_test = await api.user.get_profile(state.user.username)
        const get_test = await api.user.get_initial_test()
        const courses = await api.courses.get_courses()
        setTest({
          ...setTest,
          data: get_test,
          count_finish_modules: validation_test.courses_finish.length,
          count_total_courses: courses.results.length
        })
        if(validation_test.tests_finish.length > 0){

          setTest({
            ...stateTest,
            is_valid: true,
            count_finish_modules: validation_test.courses_finish.length,
            count_total_courses: courses.results.length

          })
        }
      }
      get_data_profile()
    },[])
  return(
     <Row>
                <Col span={24}>
                    <Card>
                        <Card.Grid>
                            <Row>
                                <Col>
                                  <Typography>Test Inicial</Typography>
                                  {stateTest.is_valid ? 
                                    'REALIZADO':
                                    <Button onClick={()=> ModalTest()} type='primary' style={{marginTop:'10px', marginLeft:'20px'}}>Realizar</Button>
                                  }
                                </Col>
                            </Row>
                        </Card.Grid >
                        <Card.Grid>
                            <Row>
                            <Col>
                                <Statistic
                                    title="Modulos Realizados"
                                    value={stateTest.count_finish_modules}
                                />
                            </Col>
                            </Row>
                        </Card.Grid>
                        <Card.Grid>
                            <Row>
                            <Col>
                                <Statistic
                                    title='Modulos Totales'
                                    value={stateTest.count_total_courses}
                                />
                            </Col>
                            </Row>
                        </Card.Grid>
                    </Card>
                </Col>
    </Row>
  )
}


export default InitialTest
