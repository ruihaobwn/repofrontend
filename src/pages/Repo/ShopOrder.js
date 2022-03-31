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
  Popconfirm,
  Modal,
  message,
  Badge,
  Drawer,
  Divider,
  Steps,
  Radio,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import OrderRecvDrawer from './OrderRecvDrawer';
import ShopSelect from '@/components/ShopSelect';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './SendOutList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, singleItem, addOrUpdate, handleUpdate } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (addOrUpdate === 'add'){
        handleAdd(fieldsValue);
      } else {
        handleUpdate(fieldsValue);
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
      title= {addOrUpdate==='add'?"新建货品预订":'货品送回'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {addOrUpdate==="add" && <div>
        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="货品名称">
          {form.getFieldDecorator('pname', {
            rules: [{ required: true, message: '请选择货品名称' }],
          })(<ShopSelect placeholder="请选择" />)}
        </FormItem>
        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="材质">
          {form.getFieldDecorator('material', {
            rules: [{required: false,}],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </div>}
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label={addOrUpdate==='add'?"预定时间":'送货时间'}>
        {form.getFieldDecorator('takedate', {
          rules: [{ required: true, message: '请选择时间' }],
        })(<DatePicker showTime/>)}
      </FormItem>
      <FormItem labelCol={{span:4}} wrapperCol={{span: 16}} label="数量">
        {form.getFieldDecorator('in_num', {
          rules: [{required: true, message: '请输入数量'}]
        })(<InputNumber placeholder="预定数量" min={1} style={{ width: '50%' }}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="备注">
        {form.getFieldDecorator('remark', {
          rules: [{ required: false, }],
        })(<Input placeholder="（选填）" />)}
      </FormItem>
    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
export default
@connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    addOrUpdate: "add",
    formValues: {},
    singleItem: {},
    drawerVisible: false,   //抽屉窗口是否显示
    sendId: '', //点击的记录ID
  };
  // 分页
  pagination = {
    current: 1,
    total: 10,
    pageSize: 50,
  }
  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id =><a onClick={()=>this.handleDrawerVisible(true, id)}>{id}</a>
    },
    {
      title: '货品名称',
      dataIndex: 'name',
      render: (dom, record) => <span>{dom}(预定{record.num}，送还{record.in_num})</span>
    },
    {
      title: '材质',
      dataIndex: 'material',
    },
    {
      title: '预定时间',
      dataIndex: 'order_date',
      render: val => <span>{moment.utc(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (val)=> {
        if (val === 'Process')
          {return <Badge status="processing" text="未结清" />;}
        else
          {return <Badge status="default" text="已结清" />;}
      },
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
     title: '操作',
      render: (text, record) => {
        return <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>送回</a>
          <Divider type="vertical" />
          <a onClick={()=>this.changeProcess(record.id, record.status)}>{record.status==='Process'?"结清":"未结清"}</a>
          <Divider type="vertical" />
          <Popconfirm
            title= '确定删除吗？'
            onConfirm={()=>this.deleteOrder(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <a style={{color: "red"}}> 删除</a>
          </Popconfirm>
        </Fragment>
      },
    },
  ];

  componentDidMount() {
    this.fetchOrderDate({status: 'Process'})
  }

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

  deleteOrder(id){
    const {dispatch} = this.props;
    dispatch({
      type: 'order/delete',
      payload: {
        id: id
      },
      callback: ()=>{
        this.fetchOrderDate()
      }
    })
    
  }

  changeProcess = (orderId, process)=> {
    const {dispatch} = this.props;
    let status = 'Done'
    if (process==='Done'){
      status = 'Process'
    }
    dispatch({
      type: 'order/changeStatus',
      payload: {
        id: orderId,
        status: status,
      },
      callback: () => {
        this.fetchOrderDate();
        message.success('修改成功');
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
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.fetchOrderDate(params)
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchOrderDate()
  };

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
      this.fetchOrderDate(values)
    });
  };

  handleModalVisible = flag => {
    this.setState({
      addOrUpdate: "add",
      modalVisible: !!flag,
    });
  };

  handleDrawerVisible = (flag, sendId) => {
    this.setState({
      drawerVisible: !!flag,
      sendId: sendId,
    });

   if (sendId){
     const {dispatch} = this.props;
     dispatch({
       type: 'order/fetchBackDetail',
       payload: {id: sendId}
     });
   }
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      addOrUpdate: "update",
      modalVisible: !!flag,
      singleItem: record || {}
    })
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const payload = {
      shop_no: fields.pname,
      order_date: moment(fields.takedate).format('YYYY-MM-DD HH:mm'),
      material: fields.material,
      num: fields.in_num,
      status: 'Process',
      remark: fields.remark
    }
    dispatch({
      type: 'order/add',
      payload: payload,
      callback: ()=>{
        this.fetchOrderDate()
        message.success('添加成功');
      }
    });
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const {singleItem} = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'order/reback',
      payload: {
        id: singleItem.id,
        date: moment(fields.takedate).format('YYYY-MM-DD HH:mm'),
        in_num: fields.in_num,
        remark: fields.remark
      },
      callback: ()=>{
        this.fetchOrderDate()
        message.success('送回成功');
      }
    });
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="Done">已结清</Option>
                  <Option value="Process">未结清</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="货品名称">
              {getFieldDecorator('name')(
                <Input style={{ width: '100%' }}>
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
      order: { data: {results, count} },
      loading,
    } = this.props;
    const { modalVisible,  singleItem, addOrUpdate } = this.state;
    this.pagination.total = count
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };
    return (
      <PageHeaderWrapper title="货品预定">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} singleItem={singleItem} addOrUpdate={addOrUpdate} />
        <OrderRecvDrawer
          onClose={()=>this.handleDrawerVisible(false, '')}
          visible={this.state.drawerVisible}
          sendId={this.state.sendId}
        >
        </OrderRecvDrawer>
      </PageHeaderWrapper>
    );
  }
}
