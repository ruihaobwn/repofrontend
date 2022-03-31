import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Table,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Drawer,
  Divider,
  Steps,
  Radio,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ShopDrawer from './ShopDrawer';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './SendOutList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const pageSize = 10;


const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  return (
    <Modal
      destroyOnClose
      title= {"添加货品"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="货品编码">
        {form.getFieldDecorator('shop_no', {
          rules: [{ required: true, message: '请输入货品编号' }],
        })(<Input placeholder="206" />)}
      </FormItem>
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="货品名称">
        {form.getFieldDecorator('shop_name', {
          rules: [{ required: true, message: '请输入货品名称' }],
        })(<Input placeholder="线条画线" />)}
      </FormItem>
      <FormItem labelCol={{span:4}} wrapperCol={{span: 16}} label="数量">
        {form.getFieldDecorator('shop_num', {
          rules: [{required: true, message: '请输入数量'}]
        })(<InputNumber placeholder="100" style={{ width: '50%' }}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="备注">
        {form.getFieldDecorator('remark', {
          rules: [{ required: false, }],
        })(<Input placeholder="（选填）" />)}
      </FormItem>
    </Modal>
  );
});


const ThresholdForm = Form.create()(props => {
  const {thresholdVisible, form, handleThresholdVisible, setThreshold,  singleItem} = props;
  const okHandle = () => {
    form.validateFields(['threshold', 'remark'], (err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      setThreshold({...fieldsValue, id: singleItem.id});
    })
  }
  
  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 4},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span:20},
    }
  }

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  return (
    <Modal
      destroyOnClose
      title = {`设置预警值：${singleItem.shop_name}`}
      visible = {thresholdVisible}
      onOk = {okHandle}
      onCancel = {() => handleThresholdVisible()}
    >
      <FormItem {...formItemLayout} label='预警值'>
        {form.getFieldDecorator('threshold', {
        })(<InputNumber placeholder="预警值" style={{ width: '50%' }} />)}
      </FormItem>
      <FormItem {...formItemLayout} label='备注'>
        {form.getFieldDecorator('remark')(<Input placeholder='（选填）' style={{width: '50%'}}/>)}
      </FormItem>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const { numVisible, form, handleNum, incOrReduce, handleNumVisible, singleItem } = props;
  const okHandle = () => {
    form.validateFields(['change_num', 'change_date', 'change_remark'], (err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (incOrReduce === 'increase'){
        handleNum({...fieldsValue, option: 'increase', id: singleItem.id});
      }else{
        handleNum({...fieldsValue, option: 'reduce', id: singleItem.id});
      }
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  return (
    <Modal
      destroyOnClose
      title= {incOrReduce==='increase'?`货品入库：${singleItem.shop_name}`:`货品售出：${singleItem.shop_name}`}
      visible={numVisible}
      onOk={okHandle}
      onCancel={() => handleNumVisible()}
    >
      <FormItem labelCol={{span:4}} wrapperCol={{span: 16}} label="数量">
        {form.getFieldDecorator('change_num', {
          rules: [{required: true, message: '请输入数量'}]
        })(<InputNumber placeholder="数量" style={{ width: '50%' }}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label={'日期'}>
        {form.getFieldDecorator('change_date', {
          rules: [{ required: true, message: '请选择日期' }],
        })(<DatePicker showTime />)}
      </FormItem>
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="备注">
        {form.getFieldDecorator('change_remark', {
          rules: [{ required: false, }],
        })(<Input placeholder="（选填）" />)}
      </FormItem>
    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
export default
@connect(({ shop}) => ({
  shop,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    numVisible: false,
    incOrReduce: 'increase',
    drawerVisible: false,
    thresholdVisible: false,
    singleItem: {},
    shopName: '',
    formValues: {},
  };
  // 分页
  pagination = {
    current: 1,
    total: 10,
  }
  columns = [
    {
      title: '货品编号',
      dataIndex: 'shop_no',
      render: (text, record) => record.threshold > record.total_num?<a style={{"color": "red"}} onClick={()=>this.handleDrawerVisible(true, record.id, record.shop_name)}>{text}</a>:<a
                                                                      onClick={()=>this.handleDrawerVisible(true, record.id, record.shop_name)}>{text}</a>
    },
    {
      title: '货品名称',
      dataIndex: 'shop_name',
      render: (text, record) => record.threshold > record.total_num ? <span style={{"color": "red"}}>{text}</span>:<span>{text}</span>,
    },
    {
      title: '库中数量',
      dataIndex: 'shop_num',
      render: (text, record) => record.threshold > record.total_num ? <span style={{"color": "red"}}>{text}</span>:<span>{text}</span>,
    },
    {
      title: '货品总量',
      dataIndex: 'total_num',
      render: (text, record) => record.threshold > record.total_num ? <span style={{"color": "red"}}>{text}</span>:<span>{text}</span>,
    },
    {
      title: '预警值',
      dataIndex: 'threshold',
      render: (text, record) => record.threshold > record.total_num ? <span style={{"color": "red"}}>{text}</span>:<span>{text}</span>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (text, record) => record.threshold > record.total_num ? <span style={{"color": "red"}}>{text}</span>:<span>{text}</span>,
    },
    {
      title: '操作',
      render: (text, record) => {
          return <Fragment>
            <a onClick={() => this.handleNumVisible(true, 'increase', record)}>直接入库</a>
            <Divider type='vertical'/>
            <a onClick={() => this.handleNumVisible(true, 'reduce', record)}>售出</a>
            <Divider type='vertical'/>
            <a onClick={() => this.handleThresholdVisible(true, record)}>设置</a>
          </Fragment>
      },
    },
  ];

  componentDidMount() {
    this.fetchShop()
  }

  fetchShop(payload={limit: pageSize, offset:0}){
    const {dispatch} = this.props;
    dispatch({
      type: 'shop/fetch',
      payload: {
        ordering: "order_no",
        ...payload
      }
    })
  }
  
  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    this.pagination.current = pagination.current
    const params = {
      limit: pagination.pageSize,
      offset: (pagination.current-1)*pagination.pageSize,
      ...formValues,
      ...filters
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.fetchShop(params)
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchShop()
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const payload = {
      shop_no: fields.shop_no,
      shop_name: fields.shop_name,
      shop_num: fields.shop_num,
      total_num: fields.shop_num,
      remark: fields.remark,
    }
    dispatch({
      type: 'shop/add',
      payload: payload,
      callback: ()=>{
        this.fetchShop()
        message.success('添加成功');
      }
    });
    this.handleModalVisible();
  };

  handleNum= fields => {
    const {dispatch} = this.props;
    const payload = {
      id: fields.id,
      date: moment(fields.change_date).format('YYYY-MM-DD HH:mm'),
      num: fields.change_num,
      remark: fields.change_remark,
      option: fields.option,
    }
    dispatch({
      type: 'shop/change_num',
      payload: payload,
      callback: ()=>{
        this.fetchShop();
        message.success('修改成功');
      }
    })
    this.handleNumVisible(false)
  }

  setThreshold = fields => {
    const {dispatch} = this.props;
    const payload = {
      id: fields.id,
      threshold: fields.threshold,
      remark: fields.remark,
    }
    dispatch({
      type: 'shop/setThreshold',
      payload: payload,
      callback: ()=>{
        message.success('设置成功');
      }
    })
    this.handleThresholdVisible(false)
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };


  handleNumVisible = (flag, option='', record={})=>{
    this.setState({
      numVisible: !!flag,
      incOrReduce: option,
      singleItem: record,
    })
  }
  
  handleDrawerVisible = (flag, shopId, shopName)=>{
    this.setState({
      drawerVisible: !!flag,
      shopName: shopName,
    });

    if (shopId){
      const {dispatch} = this.props;
      dispatch({
        type: 'shop/fetchDetail',
        payload: {id: shopId}
      });
    }
  }

  handleThresholdVisible = (flag, record={}) => {
    this.setState({
      thresholdVisible: !!flag,
      singleItem: record,
    })
  }

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });
      this.fetchShop(values)
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="货品名称">
              {getFieldDecorator('shop_name')(
                <Input placeholder="请输入" style={{ width: '100%' }}>
                </Input>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="货品编号">
              {getFieldDecorator('shop_no')(
                <Input placeholder="请输入" style={{ width: '100%' }}>
                </Input>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      shop: { data: {results, count} },
      loading,
    } = this.props;
    const {modalVisible, numVisible, incOrReduce, singleItem, thresholdVisible } = this.state;
    this.pagination.total = count;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const numMethods = {
      handleNumVisible: this.handleNumVisible,
      handleNum: this.handleNum,
    };

    const thresholdMethods = {
      handleThresholdVisible: this.handleThresholdVisible,
      setThreshold: this.setThreshold,
    };

    return (
      <PageHeaderWrapper title="货品数量">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加货品
              </Button>
            </div>
            <Table
              loading={loading}
              dataSource={results}
              columns={this.columns}
              pagination = {this.pagination}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
        <UpdateForm {...numMethods} incOrReduce={incOrReduce} singleItem={singleItem} numVisible={numVisible}/>
        <ShopDrawer
          onClose={()=>this.handleDrawerVisible(false, '')}
          visible={this.state.drawerVisible}
          shopName={this.state.shopName}
        >
        </ShopDrawer>
        <ThresholdForm {...thresholdMethods} singleItem={singleItem} thresholdVisible={thresholdVisible} />
      </PageHeaderWrapper>
    );
  }
}
