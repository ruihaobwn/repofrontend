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
  Tag,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ProductDrawer from './ProductDrawer';
import ShopSelect from '@/components/ShopSelect';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './SendOutList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

let id = 0


const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
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

  const add = () => {
    const { form } = props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: { 
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };
 
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 18, offset: 6 },
    },
  };

  const { getFieldDecorator, getFieldValue } = props.form;
  getFieldDecorator('keys', { initialValue: [] });

  const keys = getFieldValue('keys');
  const formItems = keys.map((k, index) => (
    <FormItem
      label= {index===0?'??????': ''}
      style={{ marginBottom: 0 }}
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)} 
    >
      
      <FormItem
        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
      >
        {getFieldDecorator(`nos[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "???????????????.",
            },
          ]
        })( <ShopSelect placeholder="????????????" style={{ width: '100%', marginRight: '3%' }}/>)}
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
              message: "???????????????.",
            },
          ],
        })(<InputNumber placeholder="????????????" min={1} style={{ width: '50%' }}/>)}
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

  return (
    <Modal
      destroyOnClose
      title= {"??????????????????"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem {...formItemLayout} label="??????????????????">
        {form.getFieldDecorator('product_name', {
          rules: [{ required: true, message: '???????????????????????????' }],
        })(<Input placeholder="?????????" />)}
      </FormItem>

      {formItems}

      <FormItem {...formItemLayoutWithOutLabel}>
        <Button type="dashed" onClick={add} style={{ width: '60%' }}>
          <Icon type="plus" /> ????????????
        </Button>
      </FormItem>

      <FormItem {...formItemLayout} label="??????">
        {form.getFieldDecorator('remark', {
          rules: [{ required: false, }],
        })(<Input placeholder="????????????" />)}
      </FormItem>
    </Modal>
  );
});


const UpdateForm = Form.create()(props => {
  const { updateVisible, form, handleUpdate, handleUpdateVisible, singleItem } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate({...fieldsValue, id: singleItem.id});
    });
  }

  const remove = (k, rname) => {
    const {form} = props;
    const keys = form.getFieldValue('keys');                                                                               
    const nameArray= form.getFieldValue('nameArray');                                                                               
    if(keys.length === 1){
      return
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
      nameArray: nameArray.filter(name=> name.no !== rname)
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

  const { getFieldDecorator, getFieldValue, setFieldsValue} = props.form;
  let init_len = 0
  let included_shops = []
  if (Object.keys(singleItem).length > 0){
    included_shops = singleItem.included_shops
    init_len = included_shops.length
    const array = new Array(init_len)
    const nameArray = new Array(init_len)

    for (let i = 0; i < init_len; i++){
      array[i]=i
      nameArray[i] = included_shops[i]
    }
    getFieldDecorator('keys', { initialValue: array });
    getFieldDecorator('nameArray', {initialValue: nameArray});

  }else{
    getFieldDecorator('keys', { initialValue: []});
    getFieldDecorator('nameArray', {initialValue: []});
  }

  const nameArray = getFieldValue('nameArray')
  const keys = getFieldValue('keys');
  const formItems = keys.map((k, index) => {
    let init_no = nameArray[index] ? nameArray[index].no:undefined
    let init_num = nameArray[index] ? nameArray[index].num:undefined
    return(
    <FormItem
      label= {index===0?'??????': ''}
      style={{ marginBottom: 0 }}
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)} 
    >
      
      <FormItem
        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
      >
        {getFieldDecorator(`nos[${k}]`, {
          initialValue: init_no,
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "???????????????.",
            },
          ]
        })( <ShopSelect
              placeholder="????????????" style={{ width: '100%', marginRight: '3%' }}/>)}
      </FormItem>
      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
      <FormItem
        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
        required={false}
      >
        {getFieldDecorator(`nums[${k}]`, {
          initialValue: init_num,
        })(<InputNumber placeholder="????????????" min={1} style={{ width: '60%' }}/>)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => remove(k, init_no)}
          />
        ) : null}
      </FormItem>
    </FormItem>
  )})


  return (
    <Modal
      destroyOnClose
      title= {`?????????????????????${singleItem.product_name}`}
      visible={updateVisible}
      onOk={okHandle}
      onCancel={() => {form.resetFields(); handleUpdateVisible()}}
    >
      <FormItem {...formItemLayout} label="????????????">
        {form.getFieldDecorator('change_name', {
          initialValue: singleItem.product_name,
          rules: [{ required: true, message: '?????????????????????' }],
        })(<Input placeholder="?????????" />)}
      </FormItem>

      {formItems}

      <FormItem {...formItemLayoutWithOutLabel}>
        <Button type="dashed" onClick={add} style={{ width: '60%' }}>
          <Icon type="plus" /> ??????????????????
        </Button>
      </FormItem>

    </Modal>
  );
});

const SaleForm = Form.create()(props => {
  const { saleVisible, form, handleSale, handleSaleVisible, singleItem } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSale({...fieldsValue, id: singleItem.id});
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

  return (
    <Modal
      destroyOnClose
      title= {`?????????????????????${singleItem.product_name}`}
      visible={saleVisible}
      onOk={okHandle}
      onCancel={() => {form.resetFields(); handleSaleVisible()}}
    >
      <FormItem {...formItemLayout } label="??????">
        {form.getFieldDecorator('saled_num', {
          rules: [{ required: true, }],
        })(<InputNumber placeholder="????????????" min={1} style={{ width: '60%' }}/>)}
      </FormItem>
      <FormItem {...formItemLayout } label='????????????'>
        {form.getFieldDecorator('saled_date', {
          rules: [{required: true}]
        })(<DatePicker showTime />)}
      </FormItem>  
      <FormItem {...formItemLayout } label="??????">
        {form.getFieldDecorator('sale_remark', {
          rules: [{ required: false, }],
        })(<Input placeholder="????????????" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
export default
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.order,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateVisible: false,
    saleVisible: false,
    incOrReduce: 'increase',
    drawerVisible: false,
    singleItem: {},
    productNo: '',
    formValues: {},
  };
  // ??????
  pagination = {
    current: 1,
    total: 10,
  }
  columns = [
    {
      title: '????????????',
      dataIndex: 'product_name',
    },
    {
      title: '??????????????????',
      dataIndex: 'shop_list',
      render: shops => {
        if (shops){
          const tags = shops.map(i => <Tag color='blue'>{i.name}??{i.num}</Tag>); return <div>{tags}</div>
        }else{
          return
        }
      }
    },
    {
      title: '????????????',
      dataIndex: 'created_time',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '??????',
      dataIndex: 'remark'
    },
    {
     title: '??????',
      render: (text, record) => {
          return <Fragment>
            <a onClick={() => this.handleUpdateVisible(true, record)}>??????</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleSaleVisible(true, record)}>??????</a>
          </Fragment>
      },
    },
  ];

  componentDidMount() {
    this.fetchProduct()
  }

  fetchProduct(payload={}){
    const {dispatch} = this.props;
    dispatch({
      type: 'product/fetch',
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
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.fetchProduct(params)
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchProduct()
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const shops = fields.keys.map(item => {
      return {
        no: fields.nos[`${item}`],
        num: parseInt(fields.nums[`${item}`]),
      }                                                                                                                    
    })
    

    const payload = {
      product_name: fields.product_name,
      product_no: fields.product_no,
      included_shops: shops,
      remark: fields.remark,
    }

    dispatch({
      type: 'product/add',
      payload: payload,
      callback: ()=>{
        this.fetchProduct()
        id = 0
        message.success('????????????');
      }
    });

    this.handleModalVisible();
  };

  handleUpdate= fields => {
    const {dispatch} = this.props;
    const shops = fields.keys.map(item => {
      return {
        no: fields.nos[`${item}`],
        num: parseInt(fields.nums[`${item}`]),
      }
    })
    const payload = {
      id: fields.id,
      product_name: fields. change_name,
      included_shops: shops,
    }
    dispatch({
      type: 'product/update',
      payload: payload,
      callback: ()=>{
        this.fetchProduct();
        message.success('????????????');
        id = 0;
      }
    })
    this.handleUpdateVisible(false)
  }

  handleSale = fields => {
    const { dispatch } = this.props;
    const payload = {
      id: fields.id,
      saled_num: fields.saled_num,
      remark: fields.sale_remark,
      saled_date: fields.saled_date
    }

    dispatch({
      type: 'product/sale',
      payload: payload,
      callback: ()=>{
        message.success('??????????????????');
      }
    })
    this.handleSaleVisible(false)
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };


  handleUpdateVisible = (flag, record={})=>{
    this.setState({
      updateVisible: !!flag,
      singleItem: record,
    })
  }

  handleSaleVisible = (flag, record={}) => {
    this.setState({
      saleVisible: !!flag,
      singleItem: record,
    })
  }

  handleDrawerVisible = (flag, productNo)=>{
    this.setState({
      drawerVisible: !!flag,
      productNo: productNo,
    });

    if (productNo){
      const {dispatch} = this.props;
      dispatch({
        type: 'product/fetchRecord',
        payload: {product_no: productNo}
      });
    }
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
      this.fetchProduct(values)
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
            <FormItem label="??????????????????">
              {getFieldDecorator('product_name')(
                <Input placeholder="?????????" style={{ width: '100%' }}>
                </Input>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                ??????
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                ??????
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
      product: { data: {results, count} },
      loading,
    } = this.props;
    const {modalVisible, updateVisible, saleVisible,  incOrReduce, singleItem } = this.state;
    this.pagination.total = count;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateVisible: this.handleUpdateVisible,
      handleUpdate: this.handleUpdate,
    };
    const saleMethods = {
      handleSaleVisible: this.handleSaleVisible,
      handleSale: this.handleSale,
    }

    return (
      <PageHeaderWrapper title="??????????????????">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                ??????????????????
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
        <UpdateForm {...updateMethods} incOrReduce={incOrReduce} singleItem={singleItem} updateVisible={updateVisible}/>
        <SaleForm {...saleMethods} singleItem={singleItem} saleVisible={saleVisible}/>
        <ProductDrawer
          onClose={()=>this.handleDrawerVisible(false, '')}
          visible={this.state.drawerVisible}
          productNo={this.state.productNo}
        >
        </ProductDrawer>
      </PageHeaderWrapper>
    );
  }
}
