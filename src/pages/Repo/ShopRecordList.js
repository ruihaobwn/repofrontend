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
  Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ShopNameSelect from '@/components/ShopNameSelect';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './SendOutList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;


/* eslint react/no-multi-comp:0 */
export default
@connect(({ shoprecord, loading }) => ({
  shoprecord,
  loading: loading.models.order,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateVisible: false,
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
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '货品编号',
      dataIndex: 'shop_no',
    },
    {
      title: '货品名称',
      dataIndex: 'shop_name'
    },
    {
      title: '入出库',
      dataIndex: 'option',
      render: option => option==='Sale'? '售出':'直接入库'
    },
    {
      title: '数量',
      dataIndex: 'change_num',
    },
    {
      title: '入出库时间',
      dataIndex: 'date',
      render: val => <span>{moment.utc(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '操作人',
      dataIndex: 'creator'
    },
    {
      title: '标识',
      dataIndex: 'sign',
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '操作',
      render: (text, record) => {
        return <Fragment>
          <Popconfirm
            title= '确定删除吗？'
            onConfirm={()=>this.deleteShopRecord(record.id)}
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
    this.fetchShopRecord()
  }

  fetchShopRecord(payload={limit: 10, offset:0}){
    const {dispatch} = this.props;
    dispatch({
      type: 'shoprecord/fetch',
      payload: {
        ordering: "-created_time",
        ...payload
      }
    })
  }

  deleteShopRecord = recordId => {
    const {dispatch} = this.props
    dispatch({
      type: 'shoprecord/delete',
      payload: {
        id: recordId,       
      },
      callback: ()=>{
        this.fetchShopRecord() 
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
    this.fetchShopRecord(params)
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchShopRecord()
  };

  
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
      this.fetchShopRecord(values)
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
          <FormItem label="出入库">
            {getFieldDecorator('option')(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="Inrepo">直接入库</Option>
                <Option value="Sale">售出</Option>
              </Select>
            )}
          </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <FormItem label="货品名称">
              {getFieldDecorator('shop_name')(
                <Input placeholder="请输入" style={{ width: '100%' }}>
                </Input>
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <FormItem label="货品编号">
              {getFieldDecorator('shop_no')(
                <Input placeholder="请输入" style={{ width: '100%' }}>
                </Input>
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
      shoprecord: { data: {results, count} },
      loading,
    } = this.props;
    const {modalVisible, updateVisible, incOrReduce, singleItem } = this.state;
    this.pagination.total = count;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateVisible: this.handleUpdateVisible,
      handleUpdate: this.handleUpdate,
    };

    return (
      <PageHeaderWrapper title="货物记录">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              loading={loading}
              dataSource={results}
              columns={this.columns}
              pagination = {this.pagination}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
