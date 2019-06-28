/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

import { isNotNil } from './utils';

// 获取当前日期  格式如 2018-12-15
export function getCurrentDate() {
  const currDate = new Date();
  const year = currDate.getFullYear();
  let month = (currDate.getMonth() + 1).toString();
  month = month.padStart(2, '0');
  let dateDay = currDate.getDate().toString();
  dateDay = dateDay.padStart(2, '0');
  const time = `${year}-${month}-${dateDay}`;
  return time;
}
// 获取当前日期  格式如 2018-12-15
export function getDatePlusNum(num) {
  const currDate = new Date();
  currDate.setDate(currDate.getDate() + num);
  const year = currDate.getFullYear();
  let month = (currDate.getMonth() + 1).toString();
  // month = month.padStart(2, '0');
  let dateDay = currDate.getDate().toString();
  // dateDay = dateDay.padStart(2, '0');
  const time = `${year}-${month}-${dateDay}`;
  // console.log('date',time);
  return time;
}
// 组装预约日期数据，不能选已过去的日期与时间
export function createFurterDateData() {
  const date = [];
  const currDate = new Date();
  const year = currDate.getFullYear();
  // const month = currDate.getMonth() + 1;
  for (let i = year; i <= year + 10; i++) {
    const month = [];
    for (let j = 1; j < 13; j++) {
      const day = [];
      if (j === 2) {
        for (let k = 1; k < 29; k++) {
          day.push(`${k}日`);
        }
        // Leap day for years that are divisible by 4, such as 2000, 2004
        if (i % 4 === 0) {
          day.push(`${29}日`);
        }
      } else if (
        j in
        {
          1: 1,
          3: 1,
          5: 1,
          7: 1,
          8: 1,
          10: 1,
          12: 1
        }
      ) {
        for (let k = 1; k < 32; k++) {
          day.push(`${k}日`);
        }
      } else {
        for (let k = 1; k < 31; k++) {
          day.push(`${k}日`);
        }
      }
      const m = {};
      m[`${j}月`] = day;
      month.push(m);
    }
    const y = {};
    y[`${i}年`] = month;
    date.push(y);
  }
  return date;
}
// 组装日期数据
export function createDateData() {
  const date = [];
  const currDate = new Date();
  const year = currDate.getFullYear();
  // const month = currDate.getMonth() + 1;
  for (let i = 1970; i <= year; i++) {
    const month = [];
    for (let j = 1; j < 13; j++) {
      const day = [];
      if (j === 2) {
        for (let k = 1; k < 29; k++) {
          day.push(`${k}日`);
        }
        // Leap day for years that are divisible by 4, such as 2000, 2004
        if (i % 4 === 0) {
          day.push(`${29}日`);
        }
      } else if (
        j in
        {
          1: 1,
          3: 1,
          5: 1,
          7: 1,
          8: 1,
          10: 1,
          12: 1
        }
      ) {
        for (let k = 1; k < 32; k++) {
          day.push(`${k}日`);
        }
      } else {
        for (let k = 1; k < 31; k++) {
          day.push(`${k}日`);
        }
      }
      const m = {};
      m[`${j}月`] = day;
      month.push(m);
    }
    const y = {};
    y[`${i}年`] = month;
    date.push(y);
  }
  return date;
}

const formatNumber = (num) => {
  const n = num.toString();
  return n[1] ? n : `0${n}`;
};

/**
 *  日期 + 时间 格式化 如2019-4-18 11:33:10
 * @param {Date} value
 */
export const formatTime = (value) => {
  let date = value;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

/**
 *仅 日期格式化 如 2019-4-18
 * @param {Date|String} value
 * @param {*} seperator 默认分隔符
 */
export const formatDate = (value, seperator = '-') => {
  let date = value;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [year, month, day].map(formatNumber).join(seperator);
};

/**
 * 实时获取当前时间字符串
 * @param {Date} value
 */
export const formatTimeOnly = (value) => {
  let date = value;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [hour, minute, second].map(formatNumber).join(':');
};

/* 获取某一月的总天数 */
export const getDays = (year, month) => {
  const y = year || new Date().getFullYear();
  const m = month || new Date().getMonth() + 1;
  return new Date(y, m, 0).getDate();
};

/**
 * 计算传入的日期到目前隔多少天
 * @param {*} dateStr 日期字符串格式
 */
export const howLong = (dateStr) => {
  if (!isNotNil(dateStr)) {
    return 0;
  }
  let days = 1;
  const dateStr2 = dateStr.replace(/-/g, '/');
  try {
    const time = new Date().getTime() - new Date(dateStr2).getTime();
    days = Math.floor(time / 1000 / 60 / 60 / 24);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return days > 0 ? days : 1;
};

/**
 * 以下是倒计时计算逻辑
 */

// 订单自动取消时间（ms)
const orderCancelTime = 15 * 60 * 1000;

/**
 * 生成倒计时文本字符串
 * @param {*} timestamp 计时时刻和订单时间相隔毫秒数
 * @param {*} hasHour 倒计时是否含小时，默认false
 */
export const formatByTimestamp = (timestamp, hasHour = false) => {
  const second = Math.floor(timestamp / 1000);
  if (second < 1) {
    return '';
  }
  const totalMinutes = Math.floor(second / 60);
  const _second = second % 60;
  let _secondText = '';
  _secondText = _second >= 10 ? _second : `0${_second}`;
  if (!hasHour) {
    if (totalMinutes === 0) {
      return _secondText;
    }
    const minuteText = totalMinutes >= 10 ? totalMinutes : `0${totalMinutes}`;
    return `${minuteText}:${_secondText}`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const hoursText = hours >= 10 ? hours : `0${hours}`;
  const minutesText = minutes >= 10 ? minutes : `0${minutes}`;
  if (hours === 0) {
    return `${minutesText}:${_secondText}`;
  }
  return `${hoursText}:${minutesText}:${_secondText}`;
};

/**
 * 判断是否有必要计时，如果时间已经超过应该计时的范围，就没必要倒计时定时了
 * @param {*} submitTime 订单提交时间
 */
export const isTimeToCount = (submitTime) => {
  try {
    submitTime = submitTime.replace(/-/g, '/');
    const time = new Date(submitTime).getTime();
    const now = new Date().getTime();
    if (now - time > orderCancelTime) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * 订单15分钟超时(ms)，一开始就倒计时
 * @param {*} submitTime 订单提交时间
 */
export const submitTimeCountDown = (submitTime) => {
  let result = '';
  if (!submitTime) {
    return result;
  }
  try {
    submitTime = submitTime.replace(/-/g, '/');
    const time = new Date(submitTime).getTime();
    const now = new Date().getTime();
    if (now - time > orderCancelTime) {
      // 已经超过
      return result;
    }
    const count = time + orderCancelTime - now;
    // console.log(count)
    result = formatByTimestamp(count, true);
  } catch (e) {
    // eslint-disable-next-line no-console
    // console.log(e);
  }
  return result;
};
/**
 * 转换毫秒时间数成00:00:00格式
 * @param {毫秒} timestamp
 */
export const formatTimeFromTimeStamp = (timestamp) => {
  let hour = Math.floor(timestamp / 3600);
  let minute = Math.floor((timestamp - hour * 3600) / 60);
  let seconds = timestamp - hour * 3600 - minute * 60;
  let timeText = `${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${
    seconds > 9 ? seconds : `0${seconds}`
  }`;
  return timeText;
};

export const getMonthFirstOrLaseDay = (selectMonth) => {
  let month = selectMonth || new Date().getMonth() + 1; //设置默认 如果不穿 取当前月份
  let nowdays = new Date();
  let year = nowdays.getFullYear();
  if (month === 0) {
    month = 12;
    year -= 1;
  }
  // if (month < 10) {
  //   month = `0${month}`;
  // }
  let firstDay = `${year}-${month}-1`;
  let myDate = new Date(year, month, 0);
  let lastDay = `${year}-${month}-${myDate.getDate()}`;
  return { firstDay, lastDay };
};
