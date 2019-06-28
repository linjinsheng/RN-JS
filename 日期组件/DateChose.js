import React from 'react';
import { Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { getDatePlusNum } from '../../utils/dateUtils';
import { setDp } from '../../utils/screenUtils';
import dialYello from '../OrderList/images/dialYello.png';
// import dialGreen from '../OrderList/images/dialGreen.png';

const { width } = Dimensions.get('window');

let toYear = new Date().getFullYear();
let toMonth = new Date().getMonth() + 1;
const currDate = new Date();
export default class DateChose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedDate: getDatePlusNum(1),
      dayData: [],
      month: toMonth,
      year: toYear,
      color: []
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    let { modalVisible } = props;
    this.setState({ modalVisible });
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

  cancelModal() {
    this.setState({ modalVisible: false });
  }

  dateChanged(date) {
    this.setState({ modalVisible: false });
    this.props.dateChanged(date);
  }

  // ==============================日历相关======================================

  componentDidMount() {
    let dayCount = this.getDaysOfMonth(toYear, toMonth);
    let dayIn = this.getFirstDay(toYear, toMonth);
    let temp = [];
    let color = [];
    for (let i = 1; i < dayIn; i++) {
      temp.push(' ');
      color.push(0);
    }
    for (let i = currDate.getDate(); i <= dayCount; i++) {
      temp.push(i);
      color.push(0);
    }
    this.setState({
      dayData: temp,
      color
    });
  }

  createHeaderBar = () => (
    <View
      style={{
        height: 50,
        width,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: setDp(10)
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{ paddingLeft: setDp(21), paddingRight: setDp(21) }}
        onPress={this.clickPrevious}
      >
        <Image
          style={{
            height: setDp(19),
            width: setDp(11)
          }}
          source={require('./images/up.png')}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: setDp(23),
          color: '#333333',
          fontWeight: '500'
        }}
      >
        {`${this.state.year}年${this.state.month}月`}
      </Text>
      <TouchableOpacity
        activeOpacity={1}
        style={{ paddingLeft: setDp(21), paddingRight: setDp(21) }}
        onPress={this.clickNext}
      >
        <Image
          style={{
            height: setDp(19),
            width: setDp(11)
          }}
          source={require('./images/next.png')}
          resizeMode={'contain'}
        />
        {/* <Text style={{ fontSize: 14, color: '#9EA3AD' }}>下个月</Text> */}
      </TouchableOpacity>
    </View>
  );

  createDayBar = () => (
    <View
      style={{
        height: 40,
        width,
        alignItems: 'center',
        flexDirection: 'row'
      }}
    >
      {this.createLab()}
    </View>
  );

  createLab = () => {
    let dateArray = ['一', '二', '三', '四', '五', '六', '日'];
    let array = [];
    for (let i = 1; i < 8; i++) {
      array.push(
        <View
          key={i}
          style={{
            width: width / 7,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF'
          }}
        >
          <Text
            style={{
              color: '#333333',
              fontSize: setDp(19)
            }}
          >
            {dateArray[i - 1]}
          </Text>
        </View>
      );
    }
    return array;
  };

  creatContent = () => (
    <FlatList
      data={this.state.dayData}
      numColumns={7}
      horizontal={false}
      extraData={this.state}
      renderItem={this.renderItem}
      keyExtractor={this.keyExtractor}
    />
  );

  clickItem = (item, index) => {
    if (item === ' ') {
      return;
    }
    let temp = this.state.color;
    if (temp[index] === 1) {
      temp[index] = 0;
    } else if (temp[index] === 0) {
      temp[index] = 1;
    }
    toMonth = toMonth.toString().padStart(2, '0');
    // eslint-disable-next-line no-param-reassign
    item = item.toString().padStart(2, '0');
    this.setState(
      {
        selectedDate: `${toYear}-${toMonth}-${item}`,
        color: temp
      },
      () => {
        this.dateChanged(this.state.selectedDate);
      }
    );
  };

  renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={{ width: width / 7, marginTop: setDp(20), justifyContent: 'center', alignItems: 'center' }}
      activeOpacity={1}
      onPress={this.clickItem.bind(this, item, index)}
    >
      <View
        style={{
          width: setDp(48),
          height: setDp(48),
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 360,
          backgroundColor: `${toYear}-${toMonth}-${item}` === this.state.selectedDate ? '#FECD0B' : 'white'
        }}
      >
        <Text
          style={{
            color: `${toYear}-${toMonth}-${item}` === this.state.selectedDate ? 'white' : '#333333',
            fontSize: setDp(23)
          }}
        >
          {item}
        </Text>
      </View>
    </TouchableOpacity>
  );

  keyExtractor = (item, index) => `Zdate${index}`;

  getDaysOfMonth = (year, month) => {
    let day = new Date(year, month, 0);
    let dayCount = day.getDate();
    return dayCount;
  };

  getFirstDay = (year, month) => {
    let day = new Date(year, month - 1);
    let dayCount = day.getDay();
    if (dayCount === 0) {
      dayCount = 7;
    }
    return dayCount;
  };

  clickNext = () => {
    toMonth++;
    if (toMonth > 12) {
      toMonth = 1;
      toYear++;
    }
    this.setState({
      month: toMonth,
      year: toYear
    });

    let dayCount = this.getDaysOfMonth(toYear, toMonth);
    let dayIn = this.getFirstDay(toYear, toMonth);
    let temp = [];
    let color = [];
    for (let i = 1; i < dayIn; i++) {
      temp.push(' ');
      color.push(0);
    }
    for (let i = 1; i <= dayCount; i++) {
      temp.push(i);
      color.push(0);
    }
    this.setState({
      dayData: temp,
      color
    });
  };

  clickPrevious = () => {
    //不能选择上个月
    if (toMonth <= currDate.getMonth() + 1) return;
    toMonth--;
    if (toMonth < 1) {
      toMonth = 12;
      toYear--;
    }
    this.setState({
      month: toMonth,
      year: toYear
    });
    let dayCount = this.getDaysOfMonth(toYear, toMonth);
    let dayIn = this.getFirstDay(toYear, toMonth);
    let temp = [];
    for (let i = 1; i < dayIn; i++) {
      temp.push(' ');
    }
    //当天之前的日期不选择
    if (currDate.getMonth() + 1 === toMonth) {
      for (let i = currDate.getDate(); i <= dayCount; i++) {
        temp.push(i);
      }
    } else {
      for (let i = 1; i <= dayCount; i++) {
        temp.push(i);
      }
    }
    this.setState({
      dayData: temp
    });
  };
  // ==============================日历相关======================================

  render() {
    return (
      <Modal
        animationType="fade" //slide
        visible={this.state.modalVisible}
        transparent={true}
        onRequestClose={() => this.setState({ modalVisible: false })}
      >
        <View style={styles.modalStyle}>
          <View style={styles.subView}>
            <View style={styles.canlendarStyle}>
              <View style={{ width, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: setDp(24),
                    color: '#333333',
                    fontWeight: 'bold',
                    position: 'absolute',
                    alignSelf: 'center',
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    top: setDp(23)
                  }}
                >
                  预约上门
                </Text>
                <TouchableOpacity
                  style={{
                    marginLeft: setDp(25),
                    marginTop: setDp(23)
                  }}
                  onPress={() => this.props.hideDialog()}
                >
                  <Text style={styles.actionItemTitle}>取消</Text>
                </TouchableOpacity>
              </View>
              {this.createHeaderBar()}
              {this.createDayBar()}
              <View
                style={{
                  width: '100%',
                  height: 0.5,
                  alignSelf: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: '#dddddd'
                }}
              />
              {this.creatContent()}
            </View>
          </View>
          {this.props.dialVisible ? (
            <View style={styles.phoneRow}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row'
                }}
                onPress={() => this.props.dialCall(0)}
              >
                <Image style={styles.image} source={dialYello} />
                <Text style={styles.phone}>收货人</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginLeft: setDp(20)
                }}
                onPress={() => this.props.dialCall(1)}
              >
                <Image style={styles.image} source={dialGreen} />
                <Text style={styles.phone}>提货人</Text>
              </TouchableOpacity> */}
            </View>
          ) : null}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  phoneRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 21,
    padding: setDp(10),
    marginTop: setDp(8),
    alignSelf: 'flex-start',
    marginLeft: setDp(20),
    marginBottom: setDp(20)
  },
  image: {
    width: setDp(25),
    height: setDp(25)
  },
  phone: {
    fontSize: setDp(19),
    fontWeight: '500',
    marginLeft: setDp(7)
  },
  modalStyle: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  subView: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    width,
    backgroundColor: '#fff'
  },
  canlendarStyle: {
    width,
    height: setDp(550),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: '#cccccc',
    borderTopWidth: 0.5,
    backgroundColor: 'white'
  },
  actionItemTitle: {
    color: '#EEBE00',
    fontSize: setDp(23)
  }
});
