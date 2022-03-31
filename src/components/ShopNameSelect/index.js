import React from "react";
import { connect } from 'dva';
import { Select } from "antd";

const { Option } = Select;

export default
@connect(({shop}) => ({
  shop
}))
class ShopSelect extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/fetch',
      payload: {
        simple: "yes"
      }
    });
  }

  render(){
    const {
      shop: {data: {results}}
    } = this.props;
    const options = results.map(info => <Option key={info.shop_name}>{info.shop_name}({info.shop_no})</Option>)
    return (
      <Select
        showSearch
        style={{width:200}}
        placeholder="选择货品"
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
