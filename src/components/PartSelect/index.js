import React from "react";
import { connect } from 'dva';
import { Select } from "antd";

const { Option } = Select;

export default
@connect(({part}) => ({
  part
}))
class PartSelect extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'part/fetch',
      payload: {
        simple: "yes"
      }
    });
  }

  render(){
    const {
      part: {data: {results}}
    } = this.props;
    const options = results.map(info => <Option key={info.part_name}>{info.part_name}(</Option>)
    return (
      <Select
        showSearch
        style={{width:200}}
        placeholder="选择配件"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        {...this.props}
      >
        {options}
      </Select>
    )   
  }

}
