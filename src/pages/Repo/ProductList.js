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
      label= {index===0?'货品': ''}
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

  return (
    <Modal
      destroyOnClose
      title= {"添加销售属性"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem {...formItemLayout} label="销售属性简称">
        {form.getFieldDecorator('product_name', {
          rules: [{ required: true, message: '请输入销售属性简称' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>

      {formItems}

      <FormItem {...formItemLayoutWithOutLabel}>
        <Button type="dashed" onClick={add} style={{ width: '60%' }}>
          <Icon type="plus" /> 增加货品
        </Button>
      </FormItem>

      <FormItem {...formItemLayout} label="备注">
        {form.getFieldDecorator('remark', {
          rules: [{ required: false, }],
        })(<Input placeholder="（选填）" />)}
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
      label= {index===0?'货品': ''}
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
              message: "请选择货品.",
            },
          ]
        })( <ShopSelect
              placeholder="选择货品" style={{ width: '100%', marginRight: '3%' }}/>)}
      </FormItem>
      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
      <FormItem
        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
        required={false}
      >
        {getFieldDecorator(`nums[${k}]`, {
          initialValue: init_num,
        })(<InputNumber placeholder="配件数量" min={1} style={{ width: '60%' }}/>)}
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
      title= {`编辑商品规格：${singleItem.product_name}`}
      visible={updateVisible}
      onOk={okHandle}
      onCancel={() => {form.resetFields(); handleUpdateVisible()}}
    >
      <FormItem {...formItemLayout} label="商品规格">
        {form.getFieldDecorator('change_name', {
          initialValue: singleItem.product_name,
          rules: [{ required: true, message: '请输入商品规格' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>

      {formItems}

      <FormItem {...formItemLayoutWithOutLabel}>
        <Button type="dashed" onClick={add} style={{ width: '60%' }}>
          <Icon type="plus" /> 增加商品规格
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
      title= {`售出销售属性：${singleItem.product_name}`}
      visible={saleVisible}
      onOk={okHandle}
      onCancel={() => {form.resetFields(); handleSaleVisible()}}
    >
      <FormItem {...formItemLayout } label="数量">
        {form.getFieldDecorator('saled_num', {
          rules: [{ required: true, }],
        })(<InputNumber placeholder="售出数量" min={1} style={{ width: '60%' }}/>)}
      </FormItem>
      <FormItem {...formItemLayout } label='卖出时间'>
        {form.getFieldDecorator('saled_date', {
          rules: [{required: true}]
        })(<DatePicker showTime />)}
      </FormItem>  
      <FormItem {...formItemLayout } label="备注">
        {form.getFieldDecorator('sale_remark', {
          rules: [{ required: false, }],
        })(<Input placeholder="（选填）" />)}
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
  // 分页
  pagination = {
    current: 1,
    total: 10,
  }
  columns = [
    {
      title: '属性简称',
      dataIndex: 'product_name',
    },
    {
      title: '包含货品数量',
      dataIndex: 'shop_list',
      render: shops => {
        if (shops){
          const tags = shops.map(i => <Tag color='blue'>{i.name}×{i.num}</Tag>); return <div>{tags}</div>
        }else{
          return
        }
      }
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
     title: '操作',
      render: (text, record) => {
          return <Fragment>
            <a onClick={() => this.handleUpdateVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleSaleVisible(true, record)}>售出</a>
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
        message.success('添加成功');
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
        message.success('修改成功');
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
        message.success('添加记录成功');
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
            <FormItem label="销售属性简称">
              {getFieldDecorator('product_name')(
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
      <PageHeaderWrapper title="淘宝销售属性">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加销售属性
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
