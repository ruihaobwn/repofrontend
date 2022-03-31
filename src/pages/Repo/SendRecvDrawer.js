import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {Drawer, Divider, Table, Popconfirm} from 'antd';
import moment from 'moment';


export default
@connect(({ send }) => ({
  send
}))
class SendRecvDrawer extends PureComponent {
  columns = [
    {
      title: '归还日期',
      dataIndex: 'date',
      key: 'date',
      render: val => <span>{moment.utc(val).format('YYYY-MM-DD HH:mm')}</span>
    },
    {
      title: '货品名称',
      dataIndex: 'shop_name',
      key: 'shop_name',
    },
    {
      title: '归还数量',
      dataIndex: 'change_num',
      key: 'change_num',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
       title: '操作',
       render: (_, record) => {
         return <Popconfirm
           title='确定删除吗？'
           onConfirm={()=>this.deleteRecord(record.id)}
           okText="Yes"
           cancelText="No"
         > 
           <a style={{color: "red"}}>删除</a>
         </Popconfirm>     
       }
    },
  ]

  fetchSendRecordList(){
    const {dispatch, sendId} = this.props
    dispatch({
      type: 'send/fetchBackDetail',
      payload: {id: sendId}
    });
    
  }

  fetchOrderDate(payload={}){
    const {dispatch} = this.props;
    dispatch({
      type: 'send/fetch',
      payload: {
        ordering: "-date,-id",
        ...payload
      }
    })
  } 


  deleteRecord = id =>{
    const {dispatch} = this.props;
    dispatch({
      type: 'send/deleteRecord',
      payload: {
        id: id
      },
      callback: ()=>{
        this.fetchSendRecordList()
        this.fetchOrderDate()
      }
    })
  }

  render(){
    let comebacks = null
    if (this.props.send.comeBacks){
       comebacks  = this.props.send.comeBacks;
    }

    const { sendId } = this.props;
    return (
      <Drawer
        width={1080}
        placement="right"
        closable={false}
        onClose={this.props.onClose}
        visible={this.props.visible}
        title={`归还列表（ID：${sendId}）`}
      >
        {comebacks ? <Table 
          columns={this.columns}
          dataSource={comebacks}
          pagination={false}
        >
        </Table>
        :<p>暂无归还记录</p>}

      </Drawer>
    )
  }
} 
