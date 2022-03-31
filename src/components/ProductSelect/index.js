import React from "react";
import { connect } from 'dva';
import { Select } from "antd";

const { Option } = Select;

export default
@connect(({product}) => ({
  product
}))
class ProductSelect extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetch',
      payload: {
        simple: "yes"
      }
    });
  }

  render(){
    const {
      product: {data: {results}}
    } = this.props;
    const options = results.map(info => <Option key={info.product_no}>{info.product_name}({info.product_no})</Option>)
    return (
      <Select
        showSearch
        style={{width:200}}
        placeholder="选择商品规格"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.props.children.join('').toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        {...this.props}
      >
        {options}
      </Select>
    )   
  }
}
