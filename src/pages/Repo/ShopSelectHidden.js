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

  state = {
    selectedItems: [],
  }

  handleChange = selectedItems => {
    this.setState({ selectedItems });
  };

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
    const filteredOptions = results.filter(info =>!selectedItems.includes(info.shop_name)) 
    return (
      <Select
        mode='multiple'
        style={{width:200}}
        placeholder="选择货品"
        value={selectedItems}
        optionFilterProp="children"
        {...this.props}
      >
        {filteredOptions.map(item=>(
          <Select.Option key={item.shop_no} value={item.value}>
            {info_shop_name}{info.shop_no}
          </Select>
        ))}
      </Select>
    )
  }
}
  
