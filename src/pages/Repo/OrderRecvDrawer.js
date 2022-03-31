import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {Drawer, Divider, Table, Popconfirm} from 'antd';
import moment from 'moment';

export default
@connect(({ order, send }) => ({
  order, send
}))
class OrderRecvDrawer extends PureComponent {
  columns = [
    {                                                                                 
      title: '归还日期',
      dataIndex: 'date',
      key: 'date',
      render: val => <span>{moment.utc(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '归还数量',
      dataIndex: 'num',
      key: 'num',
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

  fetchOrderDate(payload={}){
    const {dispatch} = this.props;
    dispatch({
      type: 'order/fetch',
      payload: {
        ordering: "-order_date,-id",
        ...payload                                                                                                                                                                              
      }
    })
  }
  
  fetchOrderRecordList(){
    const {dispatch, sendId} = this.props;
    dispatch({
      type: 'order/fetchBackDetail',
      payload: {id: sendId}
    });
  }

  deleteRecord = id =>{
    const {dispatch} = this.props;
    dispatch({
      type: 'order/deleteRecord',
      payload: {
        id: id
      },
      callback: ()=>{
        this.fetchOrderRecordList()
        this.fetchOrderDate()
      }
    })
  }

  render(){
    let comebacks = null
    if (this.props.order.comeBacks){
       comebacks  = this.props.order.comeBacks;
    }
    const { sendId } = this.props;
    return (
      <Drawer
        width={720}
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
