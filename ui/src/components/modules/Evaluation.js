import React, { useState, useContext } from 'react'
import { notification, Input, Button, Modal, Alert, Form, Select } from 'antd'
import { FormOutlined } from '@ant-design/icons'
import { ModulesContext } from '../../containers/Modules'
import api from '../../api/endpoints'
const { Option } = Select
const { TextArea } = Input

const Evaluation = ({questions})=> {

  const { dispatch, state:Module } = useContext(ModulesContext)
  var module = Module.module
  
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const ModalForm = ({visible, onCancel}) => {
  
    const [form] = Form.useForm()

    const onOk = () => {
      form.submit()
    }

    return(
      <Modal 
        title={`Evaluacion - ${module.title} (${module.tutor_name})`} 
        style={{top:'30px'}}
        width={'100%'}
        okText='ENVIAR RESPUESTAS'
        onCancel={onCancel}  
        visible={visible}
        confirmLoading={loading}
        onOk={onOk}>
          <Form form={form} layout='vertical' name='questionsForm'>
            {questions.map((question)=> 
            <Form.Item key={question.id} name={question.id} label={question.title} 
              rules={[{required:true, message:'Debes seleccionar una respuesta'}]}>
                <Select placeholder='Selecciona una respuesta...' size='large' listItemHeight={10} listHeight={250}>
                  {question.alternatives.map((alternative)=>
                    <Option key={alternative.id} value={alternative.id}  >                       
                        {alternative.title}                                                
                    </Option>
                  )}
                </Select>
            </Form.Item>
            
            )}
            <Alert 
              type='warning' 
              message='Una vez enviadas tus respuestas no podras realizar nuevamente la evaluacion...' 
              showIcon 
              closable />
          </Form>
      </Modal>
    )
  }
  
  const onCancel = () => {
    setVisible(false)
  }

  const showModal = () => {
    setVisible(true)
  }

  return(
    <Form.Provider 
      onFormFinish={(name, {values})=> {
        setLoading(true)
        var answers = []

        for(const [key, value] of Object.entries(values)){
          answers.push({'question':key, 'answer':value})
        }

        const request = api.courses.finish_course(module.id, answers).then((response)=> {
            dispatch({
              type:'SET_VIEW',
              is_retrieve: false 
            })
            notification.success({
              message: 'Curso Completado',
              description: `${module.title}`
            })
            setLoading(false)
        }).catch((error)=> {
          console.log(error)
          notification.warning({
            message: 'Reprobado',
            description: 'Puedes volver a intentarlo'
          })
          setLoading(false)
        })

        return request


      }}
    >
      <Button style={styles.Button}  
        type='primary' 
        onClick={showModal}>
          <FormOutlined /> 
          Relizar Evaluacion
      </Button>
      <ModalForm visible={visible} onCancel={onCancel}/>
    </Form.Provider>
  )

}

const styles = {
  Button: {
    marginTop:'100px'
  }
}


export default Evaluation
