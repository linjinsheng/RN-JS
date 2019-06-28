import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, SectionList, TouchableOpacity, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { setDp } from '../../utils/screenUtils';

const SCREEN_WIDTH = Dimensions.get('window').width; // 宽
const SCREEN_HEIGHT = Dimensions.get('window').height; // 高

export default class CommonSecondLevelChoiseDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //改变数据的数组
      dataSource: []
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    let { dataSource } = props;
    //复制保留原数据
    let source = Object.assign(dataSource);
    //for循环添加字段、删除字段
    for (let i = 0; i < source.length; i++) {
      source[i].data = props.dataSource[i].configs;
      source[i].key = i;
      source[i].isShow = 'off';
    }
    this.setState({
      dataSource: source
    });
    this.renderItem = this.renderItem.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
  }

  static propTypes = {
    dialogVisible: PropTypes.bool,
    determin: PropTypes.func.isRequired,
    hideDialog: PropTypes.func.isRequired
  };

  static defaultProps = {
    dialogVisible: false
  };

  //渲染每一个section中的每一个列表项
  renderItem(data) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: 5,
          paddingVertical: 10
        }}
        onPress={() => {
          this.props.determin(data.item);
        }}
      >
        <Text style={styles.textStyle}>{data.item.value}</Text>
      </TouchableOpacity>
    );
  }

  // 根据isShow状态判断，展开改变数据源，增加数组数据，合上删除数组里的数据
  show(data) {
    let { dataSource } = this.state;
    if (data.isShow === 'off') {
      dataSource[data.key].data = this.props.dataSource[data.key].configs;
      dataSource[data.key].isShow = 'on';
      this.setState({
        dataSource
      });
    } else {
      dataSource[data.key].data = [];
      dataSource[data.key].isShow = 'off';
      this.setState({
        dataSource
      });
    }
  }

  //渲染每个section的头部
  renderSectionHeader({ section }) {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#DCDCDC',
          padding: 5
        }}
        // onPress={() => {
        // this.show(section);
        // }}
      >
        <View>
          <Text style={{ fontSize: setDp(23), padding: 5, color: '#999999' }}>{section.value}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderItemSeparator() {
    return <View style={styles.divideLine} />;
  }

  renderSectionSeparator() {
    return <View style={{ height: 0.5, backgroundColor: '#DCDCDC' }} />;
  }

  extraUniqueKey(item, index) {
    return index + item;
  }

  render() {
    return (
      <Modal
        // presentationStyle="fullScreen"
        visible={this.props.dialogVisible}
        transparent={true}
        onRequestClose={this.props.hideDialog}
      >
        <TouchableOpacity style={styles.bg} onPress={this.props.hideDialog}>
          <TouchableOpacity style={styles.content} activeOpacity={1} onPress={() => {}}>
            <SectionList
              sections={this.state.dataSource} // 数据源
              renderItem={this.renderItem} // 渲染每一个section中的每一个列表项
              keyExtractor={this.extraUniqueKey} // 生成一个不重复的key
              renderSectionHeader={this.renderSectionHeader} // 渲染每个section的头部
              scrollEnabled={true} //默认是true，false禁止滚动
              ItemSeparatorComponent={this.renderItemSeparator.bind(this)} // item分隔线组件
              SectionSeparatorComponent={this.renderSectionSeparator.bind(this)} // section分隔线组件
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#FFFFFF',
    width: SCREEN_WIDTH,
    height: setDp(600),
    paddingBottom: setDp(25),
    paddingLeft: setDp(23),
    paddingRight: setDp(23),
    borderRadius: setDp(13),
    paddingTop: setDp(35)
  },
  bg: {
    // 全屏显示 半透明 可以看到之前的控件但是不能操作了
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(52,52,52,0.5)', // rgba  a0-1  其余都是16进制数
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  header: {
    height: 64,
    paddingTop: 14,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  textStyle: {
    fontSize: setDp(20),
    color: '#333333',
    padding: 5,
    fontWeight: '500',
    marginLeft: setDp(20)
  },
  divideLine: {
    height: 0.5,
    backgroundColor: '#DCDCDC'
  }
});
