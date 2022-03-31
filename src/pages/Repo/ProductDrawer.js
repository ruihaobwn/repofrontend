import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {Drawer, Divider, Table} from 'antd';
import moment from 'moment';

export default
@connect(({ product }) => ({
  product
}))
class OrderRecvDrawer extends PureComponent {

  columns = [                                                                                                                                                                                                                            
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: text => <a>{text}</a>,
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'name',
      render: text => {
        if (text === 'Package'){
          return <a>外包入库</a>
        }else if (text === 'Inrepo'){
          return <a>入库</a>
        }else{
          return <a>卖出</a>
        }
      },
    },
    {
      title: '数量',
      dataIndex: 'change_num',
      key: 'num',
      render: text => <a>{text}</a>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: text => <a>{text}</a>,
    }
  ]


  render(){
    let productRecord = null
    if (this.props.product.record){
       productRecord  = this.props.product.record;
    }
    const { productNo } = this.props;
    return (
      <Drawer
        width={720}
        placement="right"
        closable={false}
        onClose={this.props.onClose}
        visible={this.props.visible}
        title={`记录列表（ID：${productNo}）`}
      >
        {productRecord ? <Table
          columns={this.columns}
          dataSource={productRecord}
          pagination={false}
         >
         </Table>:<p>暂无归还记录</p>
        }
      </Drawer>
    )
  }
} 
