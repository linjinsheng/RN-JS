import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import CheckBox from 'react-native-check-box';
import { API_BASE_VERSION } from '../../../api_version';
import FetchUtils from '../../../service/fetch';
import { setDp } from '../../../utils/screenUtils';
import checkImage from '../../../images/check_box.png';
import checkImageed from '../../../images/check_box_un.png';

const SCREEN_WIDTH = Dimensions.get('window').width; // 宽
const SCREEN_HEIGHT = Dimensions.get('window').height; // 高
export default class AddressDialog extends Component {
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
                  const { currentLevel } = this.state;
                  let level = currentLevel;
                  if (currentLevel === 0) {
                    this.props.hideDialog();
                  } else if (currentLevel === 1) {
                    level = 0;
                  } else {
                    level = 1;
                  }
                  this.setState({
                    currentLevel: level
                  });
                }}
              >
                <Text style={styles.button}>{this.state.currentLevel === 0 ? '取消' : '返回'}</Text>
              </TouchableOpacity>
              {/* 必须选择到市时，在省的时候不给确定按钮 */}
              {this.getDeterminBtn()}
            </View>
            <FlatList
              style={{
                marginTop: setDp(39)
              }}
              ItemSeparatorComponent={this.separatorComponent}
              data={
                // eslint-disable-next-line no-nested-ternary
                this.state.currentLevel === 0
                  ? this.state.provinces
                  : this.state.currentLevel === 1
                  ? this.state.citys
                  : this.state.areas
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  key={item.id}
                  onPress={() => {
                    switch (this.state.currentLevel) {
                      case 0:
                        this.setState({
                          currentProvince: item,
                          currentCity: {},
                          currentArea: {}
                        });
                        break;
                      case 1:
                        this.setState({
                          currentCity: item,
                          currentArea: {}
                        });
                        if (this.props.selectedLevel === 1) {
                          this.setState({
                            currentLevel: 0
                          });
                          this.props.determin(this.state.currentProvince, item);
                          return;
                        }
                        break;
                      case 2:
                        if (!this.props.multipleSelection && this.state.currentLevel === 2) {
                          this.setState({
                            currentLevel: 0
                          });
                          this.props.determin(this.state.currentProvince, this.state.currentCity, item);
                        } else {
                          // 处理多选的情况
                          this.onClick(item);
                        }
                        break;
                      default:
                        break;
                    }
                    if (this.state.currentLevel !== 2) {
                      this.fetchAllArea(
                        {
                          parentId: item.id, // 上级id
                          parentCode: item.code // 上级Code
                        },
                        (data) => {
                          if (this.state.currentLevel === 0) {
                            this.setState({
                              currentLevel: 1,
                              citys: data
                            });
                          } else {
                            if (this.props.multipleSelection) {
                              for (let i = 0; i < data.length; i++) {
                                data[i].isChecked = false;
                              }
                            }
                            this.setState({
                              currentLevel: 2,
                              areas: data
                            });
                          }
                        }
                      );
                    }
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      color: '#999999',
                      fontSize: setDp(24)
                    }}
                  >
                    {item.name}
                  </Text>
                  {this.props.multipleSelection && this.state.currentLevel === 2 ? (
                    <CheckBox
                      onClick={() => this.onClick(item)}
                      isChecked={item.isChecked}
                      checkedImage={
                        <Image
                          source={checkImage}
                          style={{
                            width: setDp(28),
                            height: setDp(28)
                          }}
                        />
                      }
                      unCheckedImage={
                        <Image
                          source={checkImageed}
                          style={{
                            width: setDp(28),
                            height: setDp(28)
                          }}
                        />
                      }
                    />
                  ) : null}
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  }

  getDeterminBtn() {
    if (this.state.currentLevel <= this.props.selectedLevel) {
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
          backgroundColor: '#DCDCDC',
          marginBottom: setDp(21),
          marginTop: setDp(21)
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
    backgroundColor: '#f5f5f5',
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
  }
});
