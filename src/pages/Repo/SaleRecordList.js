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
  Popconfirm,
  Tag,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './SendOutList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;


/* eslint react/no-multi-comp:0 */
export default
@connect(({ salerecord, loading }) => ({
  salerecord,
  loading: loading.models.order,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
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
      title: '商品编号',
      dataIndex: 'commodity_no',
    },
    {
      title: '商品名称',
      dataIndex: 'commodity_name'
    },
    {
      title: '商品规格编码',
      dataIndex: 'product_no'
    },
    {
      title: '商品规格',
      dataIndex: 'product_name',
    },
    {
      title: '销售数量',
      dataIndex: 'saled_num',
    },
    {
      title: '规格对应的货品',
      dataIndex: 'shop_list',
      render: shops => {const tags = shops.map(i => <Tag color='blue'>{i.name}×{i.num}</Tag>); return <div>{tags}</div>}
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
      title: '标识',
      dataIndex: 'sign',
    },
    {
      title: '操作',
      render: (text, record) => {
          return <Fragment>
            <Popconfirm
              title='确定删除吗？'
              onConfirm={()=>this.deleteRecord(record.id)}
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
    this.fetchSaleRecord()
  }

  fetchSaleRecord(payload={limit: 10, offset:0}){
    const {dispatch} = this.props;
    dispatch({
      type: 'salerecord/fetch',
      payload: {
        ordering: "-created_time",
        ...payload
      }
    })
  }

  deleteRecord(id){
    const { dispatch } = this. props;
    dispatch({
      type: 'salerecord/delete',
      payload: {
        id: id 
      },
      callback: ()=>{
        this.fetchSaleRecord() 
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
    this.fetchSaleRecord(params)
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchSaleRecord()
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
      this.fetchSaleRecord(values)
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
            <FormItem label="商品名称">
              {getFieldDecorator('commodity_name')(
                <Input placeholder="请输入" style={{ width: '100%' }}>
                </Input>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商品规格">
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
      salerecord: { data: {results, count} },
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
      <PageHeaderWrapper title="销售记录">
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
