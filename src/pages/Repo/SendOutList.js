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
  Popconfirm,
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
import ShopSelect from '@/components/ShopSelect';
import ProductSelect from '@/components/ProductSelect';

import SendRecvDrawer from './SendRecvDrawer';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './SendOutList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
let id = 0;
let jd = 0;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, singleItem, addOrUpdate, handleUpdate, shopOptions } = props;
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

  const remove = k => {
    const {form} = props;
    const keys = form.getFieldValue('keys');
    if(keys.length === 1){
      return
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  const removeJ = j => {
    const {form} = props;
    const jeys = form.getFieldValue('jeys');
    form.setFieldsValue({
      jeys: jeys.filter(jey => jey !== j),
    });
  }

  const add = () => {
    const { form } = props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  const addJ = ()=>{
    const {form} = props;
    const jeys = form.getFieldValue('jeys');
    const nextJeys = jeys.concat(jd++);
    form.setFieldsValue({
      jeys: nextJeys,
    });
  }

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

  const { getFieldDecorator, getFieldValue } = props.form;
  getFieldDecorator('keys', { initialValue: [] });
  getFieldDecorator('jeys', { initialValue: [] });

  const keys = getFieldValue('keys');
  const jeys = getFieldValue('jeys')
  const selects = shopOptions.map(item => <Option key={item.shop_no}>{item.shop_name}({item.shop_no})</Option>)
  const shopSelect = <Select
    placeholder='选择配件'
    style={{width: '100%', marginRight: '3%'}}
  >
    {selects}
  </Select>

  const formItems = keys.map((k, index) => (
    <FormItem
      label= {index===0?'货品': ''}
      style={{ marginBottom: 0 }}
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)} 
    >
      
      <FormItem
        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "请选择货品.",
            },
          ]
        })( <ShopSelect placeholder="选择配件" style={{ width: '100%', marginRight: '3%' }}/>)}
      </FormItem>
      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
      <FormItem
        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
        required={false}
      >
        {getFieldDecorator(`nums[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "请填写数量.",
            },
          ],
        })(<InputNumber placeholder="配件数量" min={1} style={{ width: '50%' }}/>)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => remove(k)}
          />
        ) : null}
      </FormItem>
    </FormItem>
  ));

  const jFormItems = jeys.map((j, index) => (
    <FormItem
      label= {index===0?'成品': ''}
      style={{ marginBottom: 0 }}
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)} 
    >
      <FormItem
        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
      >
        {getFieldDecorator(`pnames[${j}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "请选择商品.",
            },
          ],
        })(<ProductSelect placeholder="选择商品" style={{ width: '100%', marginRight: '3%' }}/>)}
      </FormItem>
      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
      <FormItem
        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
        required={false}
      >
        {getFieldDecorator(`pnums[${j}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "请填写数量.",
            },
          ],
        })(<InputNumber placeholder="商品数量" min={1} style={{ width: '50%' }}/>)}
        {
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => removeJ(j)}
          />
        }
      </FormItem>
    </FormItem>
  ));

  return (
    <Modal
      destroyOnClose
      title= {addOrUpdate==='add'?"新建外包任务":'货品归还'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {addOrUpdate==="add" && <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="领取人">
        {form.getFieldDecorator('taker', {
          rules: [{ required: true, message: '请输入领取人' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>}
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label={addOrUpdate==='add'?"领取时间":'归还时间'}>
        {form.getFieldDecorator('takedate', {
          rules: [{ required: true, message: '请选择日期' }],
        })(<DatePicker showTime/>)}
      </FormItem>

      {formItems}

      <FormItem {...formItemLayoutWithOutLabel}>
        <Button type="dashed" onClick={add} style={{ width: '60%' }}>
          <Icon type="plus" /> 增加货品
        </Button>
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
@connect(({ send, loading }) => ({
  send,
  loading: loading.models.send,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    addOrUpdate: "add",
    shopOptions: [],
    formValues: {},
    singleItem: {},
    drawerVisible: false,   //抽屉窗口是否显示
    sendId: '', //点击的记录ID
  };
  // 分页
  pagination = {
    current: 1,
    total: 10,
  }

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => <a onClick={()=>this.handleDrawerVisible(true, id)}>{id}</a>,
    },
    {
      title: '领取人',
      dataIndex: 'name',
    },
    {
      title: '领取数量',
      dataIndex: 'sendoutshops',
      render: (dom,_) => {
        return(<div>
          {dom.map(item => (
            item.option === 'Bring'?<p>{item.shop_name}（领走{item.out_num}，已还{item.in_num}）</p>:
            <p style={{color: 'green'}}>{item.shop_name}（已还{item.in_num}）</p>
          ))}
        </div>)
      }
    },
    {
      title: '领取日期',
      dataIndex: 'date',
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
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>归还</a>
          <Divider type="vertical" />
          <a onClick={()=>this.changeProcess(record.id, record.status)}>{record.status==='Process'?"结清":"未结清"}</a>
          <Divider type="vertical" />
          <Popconfirm
            title='确定删除吗？'
            onConfirm={()=>this.deleteSend(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <a style={{color: "red"}}>删除</a>
          </Popconfirm>
        </Fragment>
      },
    },
  ];

  componentDidMount() {
    this.fetchOrderDate({'status': 'Process'})
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

  deleteSend = id =>{
    const {dispatch} = this.props;
    dispatch({
      type: 'send/delete',
      payload: {
        id: id
      },
      callback: ()=>{
        this.fetchOrderDate()
      }
    })
  }

  changeProcess = (sendId, process)=> {
    const {dispatch} = this.props;
    let status = 'Done'
    if (process==='Done'){
      status = 'Process'
    }
    dispatch({
      type: 'send/changeStatus',
      payload: {
        id: sendId,
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
       type: 'send/fetchBackDetail',
       payload: {id: sendId}
     });
   }
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      addOrUpdate: "update",
      modalVisible: !!flag,
      singleItem: record || {},
      shopOptions: record.sendoutshops
    })
  };

  handleAdd = fields => {
    if (fields.keys.length===0){
      message.error('货品不能为空')
      return
    }
    const shops = fields.keys.map(item => {
      return {
        no: fields.names[`${item}`],
        out_num: parseInt(fields.nums[`${item}`]),
      }
    })

    const { dispatch } = this.props;
    const payload = {
      name: fields.taker,
      date: moment(fields.takedate).format('YYYY-MM-DD HH:mm'),
      take: shops,
      status: 'Process',
      remark: fields.remark
    }
    dispatch({
      type: 'send/add',
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
    //归还配件数
    if (fields.keys.length===0) {
      message.error('归还的配件不能为空')
      return
    }
    const reback = fields.keys.map(item => {
      return {
        no: fields.names[`${item}`],
        in_num: parseInt(fields.nums[`${item}`]),
      }
    })

    const { dispatch } = this.props;
    dispatch({
      type: 'send/reback',
      payload: {
        id: singleItem.id,
        shop: reback,
        date: fields.takedate.format('YYYY-MM-DD'),
        remark: fields.remark
      },
      callback: () => {
        this.fetchOrderDate()
        message.success('归还成功');
      }
    });
    this.handleModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="领取人">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <FormItem label="包含货品">
              {getFieldDecorator('shop_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="Done">已结清</Option>
                  <Option value="Process">未结清</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
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
      send: { data: {results, count} },
      loading,
    } = this.props;
    const { modalVisible,  singleItem, addOrUpdate, shopOptions } = this.state;
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
      <PageHeaderWrapper title="货品外包整合">
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} singleItem={singleItem} addOrUpdate={addOrUpdate} shopOptions={shopOptions} />
        <SendRecvDrawer
          onClose={()=>this.handleDrawerVisible(false, '')}
          visible={this.state.drawerVisible}
          sendId={this.state.sendId}
        >
        </SendRecvDrawer>
      </PageHeaderWrapper>
    );
  }
}
