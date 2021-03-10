import React, { useContext, useEffect, useState } from 'react'
import { Steps ,PageHeader, Tooltip,  Row, Col, Tag, Spin, Typography } from 'antd'
import ReactPlayer  from 'react-player'
import { ModulesContext } from '../../containers/Modules'
import api from '../../api/endpoints'
import { FileTwoTone } from '@ant-design/icons'
import Evaluation from './Evaluation'
const { Paragraph, Title } = Typography
const { Step } = Steps


const DetailModule = () => {
  
  const [state, setState] = useState({
    module:null,
    image: null,
    questions: null,
    resources: null,
    title: null,
    tutor_name: null,
    videos: null,
    description: null,

  })

  const { dispatch, state:stateModules } = useContext(ModulesContext)
  var is_approved = stateModules.is_approved
  var id_module = stateModules.module.id


  useEffect(()=> {

    async function get_module_retrieve(id_module) {
      const request = await api.courses.get_retrieve_course(id_module).then((response)=>
        setState({
          ...state,
          module: response,
          image: response.image,
          questions: response.questions,
          resources: response.resources,
          title: response.title,
          tutor_name: response.tutor_name,
          videos: response.videos,
          description: response.description,
          current: 0
        })
      )
      return request
    }
    get_module_retrieve(id_module)

  }, [])


  return(
    <>
      <Row around='xs'>
        <Col>
          <PageHeader 
            title={`${stateModules.module.title}`}
            onBack = {()=> dispatch(
              {
                type:'SET_VIEW', 
                is_retrieve: false, 
                module: null, 
                is_approved: false
              }
            )}
          />
        </Col>
        <Col>
          {is_approved ? 
            <Tag style={styles.Tag} 
              color='blue' >Aprobado</Tag> : 
            <>
              <Tag style={styles.Tag}  
                color='geekblue'>En proceso</Tag> <Spin size='small'/>
            </>}
        </Col>
      </Row>
      <Row>
        <Col span={8} style={{padding:'30px'}}>
          <Paragraph style={{marginBottom:'50px'}}>{state.description}</Paragraph>
          {state.resources && 
            <Row>
            <Title level={4}>Recursos Disponibles</Title>
            <Col span={24}>
              {state.resources.map((resource, index)=>
                  <Tooltip key={index} title={resource.title} >
                  <a ref='noreferrer' href={`http://emprendescena.cl:8000${resource.file_re}`} target="__blank">
                  <FileTwoTone style={{fontSize:'40px', marginRight:'20px', marginBottom:'10px'}} />
                  </a>
                  </Tooltip>
              )}
            </Col>
            {!is_approved &&
                <Evaluation questions={state.questions}  />
            }
            </Row>

          }
        </Col>
        <Col span={13} >
          {state.videos && 
            <>
              <Steps style={{marginBottom:'20px', marginLeft:'25px'}} current={state.current} onChange={(step)=>setState({...state, current: step})}>
                {state.videos.map((video)=><Step key={video.id} title={video.title}  />)}
              </Steps>
              {state.videos.map((video, index)=>
                <>
                  {index === state.current &&
                    <ReactPlayer controls={true} key={index}  style={{marginBottom:'20px', marginLeft:'25px'}}  url={video.url} />
                  }
                </>
              )}
            </>
          }
        </Col>
      </Row>
    </>
  )

}

const styles = {
  
  Tag: {
    marginTop:'25px'
  }
  
}

export default DetailModule
