import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {Drawer, Row, Col, Statistic} from 'antd';
import moment from 'moment';

export default
@connect(({ shop }) => ({
  shop
}))
class ShopDrawer extends PureComponent {

  render(){
    let detailNum  = null
    if (this.props.shop.detailNum){
      detailNum =  this.props.shop.detailNum;
    }
    const { shopName} = this.props;
    return (
      <Drawer
        width={720}
        placement="right"
        closable={false}
        onClose={this.props.onClose}
        visible={this.props.visible}
        title={`记录列表（商品名称：${shopName}）`}
      >
      {
        detailNum?<Row gutter={16}>
          <Col span={8}>
            <Statistic title="仓库库存" value={detailNum.stock_num} />
          </Col>
          <Col span={8}>
            <Statistic title="外包未还" value={detailNum.send_num} />
          </Col>
          <Col span={8}>
            <Statistic title="预定未送达" value={detailNum.order_num} />
          </Col>
        </Row>:<p>暂无数据</p>
      }
      </Drawer>
    )
  }
} 
