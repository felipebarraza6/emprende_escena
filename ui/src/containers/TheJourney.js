import React, { useContext } from 'react'
import { Row, Col, Table, Tag, Statistic } from 'antd'
import {AuthContext} from '../App'
import { ReconciliationOutlined  } from '@ant-design/icons'

const TheJourney = () => {
  
  const { state:user } = useContext(AuthContext)
  const approved_courses = user.approved_courses

  const columns = [
    {
      title: 'Modulo',
      render: (module)=> <Tag style={{fontSize:'17px', padding:'3px'}} color='blue'>{module.course.title}</Tag>
    },
    {
      title: 'Fecha de finalizacion',
      render: (module)=> <Tag color='magenta' style={{fontSize:'13px'}}>{module.created.slice(0,10)} - {module.created.slice(11,19)}</Tag>
    },
    {
      title: 'Codigo de Validacion',
      render: (module)=> <Tag style={{fontSize:'17px', padding:'3px'}} color='purple'>{module.code_travel}</Tag>
    },
    {
      title: 'Calificacion(pts)',
      render: (module)=> <Statistic value= {`${module.calification}.0`} prefix={<ReconciliationOutlined />} />
    }

  ] 

    return(
    <Row style={styles.container}>
      <Col span={24}>
      <Table title={()=> 'MODULOS VALIDADOS PARA VIAJE DEL EMPRENDEDOR'} columns={columns} dataSource={approved_courses} />
      </Col>
    </Row>
  )

}

const styles = {
  
  container: {
    padding:'30px'
  }

}


export default TheJourney
