import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { API_BASE_VERSION } from '../../../api_version';
import FetchUtils from '../../../service/fetch';
import { setDp } from '../../../utils/screenUtils';

const SCREEN_WIDTH = Dimensions.get('window').width; // 宽
const SCREEN_HEIGHT = Dimensions.get('window').height; // 高
export default class AddressDialogH extends Component {
  // 构造
  constructor(props) {
    super(props);
    this.state = {
      provinces: [], // 所有的省列表
      citys: [],
      areas: [],
      currentLevel: 0,
      currentProvince: {},
      currentCity: {},
      currentArea: {}
    };
  }

  UNSAFE_componentWillMount() {
    this.fetchAllArea({}, (data) => {
      this.setState({
        provinces: data,
        currentLevel: 0
      });
    });
  }

  onClick(item) {
    this.setState({
      currentLevel: 2
    });
    item.isChecked = !item.isChecked;
    this.setState({
      areas: this.state.areas
    });
  }

  fetchAllArea(param, callback) {
    FetchUtils.postNoVerification(`${API_BASE_VERSION}/area/findAreaList`, param)
      .then((result) => {
        callback(result.data);
      })
      .catch(() => {});
  }

  static propTypes = {
    addressDialogVisible: PropTypes.bool,
    determin: PropTypes.func.isRequired,
    hideDialog: PropTypes.func.isRequired
  };

  static defaultProps = {
    selectedLevel: 2,
    addressDialogVisible: false
  };

  render() {
    return (
      <Modal
        // presentationStyle="fullScreen"
        visible={this.props.addressDialogVisible}
        transparent={true}
        onRequestClose={this.props.hideDialog}
      >
        <TouchableOpacity style={styles.bg} onPress={this.props.hideDialog}>
          <TouchableOpacity activeOpacity={1} style={styles.content} onPress={() => {}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <TouchableOpacity
                style={{
                  marginLeft: setDp(25),
                  marginTop: setDp(23)
                }}
                onPress={() => {
                  this.props.hideDialog();
                }}
              >
                <Text style={styles.button}>取消</Text>
              </TouchableOpacity>
              {/* 必须选择到市时，在省的时候不给确定按钮 */}
              {this.getDeterminBtn()}
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: setDp(39),
                marginBottom: setDp(15)
              }}
            >
              <FlatList
                style={{
                  flex: 1
                }}
                data={this.state.provinces}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.itemBgStyle}
                    key={item.id}
                    onPress={() => {
                      let { currentProvince } = this.state;
                      if (currentProvince) currentProvince.isChecked = false;
                      item.isChecked = true;
                      currentProvince = item;
                      this.setState({
                        currentLevel: 0,
                        currentProvince,
                        currentCity: {},
                        currentArea: {}
                      });
                      this.fetchAllArea(
                        {
                          parentId: item.id, // 上级id
                          parentCode: item.code // 上级Code
                        },
                        (data) => {
                          this.setState({
                            citys: data,
                            areas: []
                          });
                        }
                      );
                    }}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          color: item.isChecked ? '#101010' : '#999999',
                          fontWeight: item.isChecked ? 'bold' : 'normal'
                        }
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <View style={{ height: '100%', width: 0.5, backgroundColor: '#dcdcdc' }} />
              <FlatList
                style={{
                  flex: 1
                }}
                data={this.state.citys}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.itemBgStyle}
                    key={item.id}
                    onPress={() => {
                      let { currentCity } = this.state;
                      if (currentCity) currentCity.isChecked = false;
                      item.isChecked = true;
                      currentCity = item;
                      this.setState({
                        currentLevel: 1,
                        currentCity,
                        currentArea: {}
                      });
                      if (this.props.selectedLevel === 1) {
                        // this.setState({
                        //   currentLevel: 0
                        // });
                        this.props.determin(this.state.currentProvince, item);
                      } else {
                        this.fetchAllArea(
                          {
                            parentId: item.id, // 上级id
                            parentCode: item.code // 上级Code
                          },
                          (data) => {
                            if (this.props.multipleSelection) {
                              for (let i = 0; i < data.length; i++) {
                                data[i].isChecked = false;
                              }
                            }
                            this.setState({
                              areas: data
                            });
                          }
                        );
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          color: item.isChecked ? '#101010' : '#999999',
                          fontWeight: item.isChecked ? 'bold' : 'normal'
                        }
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <View style={{ height: '100%', width: 0.5, backgroundColor: '#dcdcdc' }} />
              <FlatList
                style={{
                  flex: 1
                }}
                data={this.state.areas}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.itemBgStyle}
                    key={item.id}
                    onPress={() => {
                      this.setState({
                        currentLevel: 2
                      });
                      if (!this.props.multipleSelection) {
                        item.isChecked = true;
                        this.props.determin(this.state.currentProvince, this.state.currentCity, item);
                      } else {
                        // 处理多选的情况
                        this.onClick(item);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          color: item.isChecked ? '#101010' : '#999999',
                          fontWeight: item.isChecked ? 'bold' : 'normal'
                        }
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  }

  getDeterminBtn() {
    if (this.state.currentLevel < this.props.selectedLevel) {
      return null;
    }
    return this.btnDetermin();
  }

  btnDetermin() {
    return (
      <TouchableOpacity
        style={{
          marginRight: setDp(25),
          marginTop: setDp(23)
        }}
        onPress={() => {
          // this.state.currentLevel = 0;
          if (!this.props.multipleSelection && this.state.currentLevel === 2) {
            this.setState({
              currentLevel: 0
            });
            this.props.determin(this.state.currentProvince, this.state.currentCity, this.state.currentArea);
          } else {
            // 处理多选的情况
            const areas = [];
            for (let i = 0; i < this.state.areas.length; i++) {
              if (this.state.areas[i].isChecked) {
                areas.push(this.state.areas[i]);
              }
            }
            this.setState({
              currentLevel: 0
            });
            this.props.determin(this.state.currentProvince, this.state.currentCity, areas);
          }
        }}
      >
        <Text style={styles.button}>确定</Text>
      </TouchableOpacity>
    );
  }

  /* 分割线 */
  separatorComponent() {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: '#DCDCDC'
        }}
      />
    );
  }
}
const styles = StyleSheet.create({
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
  content: {
    backgroundColor: '#FFFFFF',
    width: SCREEN_WIDTH,
    height: setDp(500),
    paddingLeft: setDp(23),
    paddingRight: setDp(23),
    borderRadius: setDp(13),
    paddingBottom: setDp(25)
  },
  line: {
    height: 2,
    backgroundColor: '#DCDCDC',
    marginTop: 11
  },
  button: {
    color: '#EEBE00',
    fontSize: setDp(23)
  },
  text: {
    flex: 1,
    textAlign: 'center',
    color: '#999999',
    fontSize: setDp(20)
  },
  itemBgStyle: {
    flexDirection: 'row',
    paddingVertical: setDp(13)
  }
});
