import { Linking, Platform } from 'react-native';
import { ToastUtil } from '../service/Toast';

// transit 公交
// navigation 导航（百度）
// driving 驾车
// walking 步行
// amap:t = 0（驾车）= 1（公交）= 2（步行）= 3（骑行）= 4（火车android）= 5（长途客车android）
export default class RoutePlan {
  static Mode = {
    TRANSIT: { baidu: 'transit', qMap: 'bus', amap: 1 },
    DRIVING: { baidu: 'driving', qMap: 'drive', amap: 0 },
    WALKING: { baidu: 'walking', qMap: 'walk', amap: 2 },
    RIDING: { baidu: 'riding', qMap: 'bike', amap: 3 },
    NAVIGATION: { baidu: 'navigation', qMap: 'drive', amap: 0 }
  };

  static isInstallAmap = () =>
    new Promise((resolve) => {
      Linking.canOpenURL(Platform.OS === 'android' ? 'amapuri://route/plan/' : 'iosamap://path')
        .then((supported) => {
          resolve(supported);
        })
        .catch(() => {
          resolve(false);
        });
    });

  static isInstallBaiDuMap = () =>
    new Promise((resolve) => {
      Linking.canOpenURL('baidumap://map/direction')
        .then((supported) => {
          resolve(supported);
        })
        .catch(() => {
          resolve(false);
        });
    });

  static isInstallQQMap = () =>
    new Promise((resolve) => {
      Linking.canOpenURL('qqmap://map/routeplan')
        .then((supported) => {
          resolve(supported);
        })
        .catch(() => {
          resolve(false);
        });
    });

  /**
   * 打开高德地图导航
   * @param {String} data.sname - 起点名字.
   * @param {String} data.sourceApplication - 应用名字.
   * @param {String|number} data.slon - 起点经度.
   * @param {String|number} data.slat - 起点纬度.
   * @param {String} data.dname - 终点名字.
   * @param {String|number} data.dlon - 终点经度.
   * @param {String|number} data.dlat - 终点纬度.
   * @param{Mode} data.mode 导航类型
   * @param data
   */
  static openAmap = (data = {}) => {
    let base = Platform.OS === 'android' ? 'amapuri://route/plan/?' : 'iosamap://path?';
    return new Promise((resolve, reject) => {
      base += `sourceApplication=${data.sourceApplication || 'test'}`;
      // 起点经纬度不传，则自动将用户当前位置设为起点
      if (!data.dlat || !data.dlon) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('需要终点经纬度');
      } else {
        if (data.slon && data.slat) {
          base += `&slat=${data.slat}&slon=${data.slon}`;
        }
        if (data.sname) {
          base += `&sname=${data.sname}`;
        }
        if (data.dname) {
          base += `&dname=${data.dname}`;
        }
        base += `&dlat=${data.dlat}&dlon=${data.dlon}&dev=0&t=${data.mode ? data.mode.amap || 0 : 0}`;
        Linking.openURL(base)
          .then(() => {
            // resolve('打开成功');
          })
          .catch(() => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('暂无安装高德地图');
          });
      }
    });
  };

  /**
   * 打开腾讯地图导航
   * @param {String} data.sname - 起点名字.
   * @param {String|number} data.slon - 起点经度.
   * @param {String|number} data.slat - 起点纬度.
   * @param {String} data.dname - 终点名字.
   * @param {String|number} data.dlon - 终点经度.
   * @param {String|number} data.dlat - 终点纬度.
   * @param{Mode} data.mode 导航类型
   * @param data
   */
  static openQQMap = (data = {}) => {
    let base = 'qqmap://map/routeplan？';
    return new Promise((resolve, reject) => {
      // 起点经纬度不传，则自动将用户当前位置设为起点
      if (!data.slat || !data.slon || !data.dlat || !data.dlon) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('需要起点终点经纬度');
      } else {
        if (data.sname) {
          base += `&from=${data.sname}`;
        }
        base += `&fromcoord=${data.slat},${data.slon}&tocoord=${data.dlat},${data.dlon}`;
        if (data.dname) {
          base += `&to=${data.dname}`;
        }
        base += `&type=${data.mode ? data.mode.qMap || 'drive' : 'drive'}`;
        Linking.openURL(base)
          .then(() => {
            // resolve('打开成功');
          })
          .catch(() => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('暂无安装腾讯地图');
          });
      }
    });
  };

  /**
   * 打开百度地图导航
   * @param {String} data.sname - 起点名字.
   * @param {String|number} data.slon - 起点经度.
   * @param {String|number} data.slat - 起点纬度.
   * @param {String} data.dname - 终点名字.
   * @param {String|number} data.dlon - 终点经度.
   * @param {String|number} data.dlat - 终点纬度.
   * @param{Mode} data.mode 导航类型
   * @param data
   */
  static openBaiDuMap = (data = {}) => {
    let base = 'baidumap://map/direction?';
    return new Promise((resolve, reject) => {
      // 起点经纬度不传，则自动将用户当前位置设为起点
      if (!data.dlat || !data.dlon) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('需要终点经纬度');
      } else if (!data.dname && !data.dlon && !data.slat) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('需要传终点名称或者经纬度');
      } else {
        if (data.slon && data.slat) {
          base += `origin=name:${data.sname}|latlng:${data.slat},${data.slon}`;
        } else {
          base += `origin=${data.sname}`;
        }

        if (data.dlon && data.dlat) {
          base += `&destination=name:${data.dname}|latlng:${data.dlat},${data.dlon}`;
        } else {
          base += `&destination=${data.dname}`;
        }
        base += `&mode=${data.mode ? data.mode.baidu || 'driving' : 'driving'}`;
        Linking.openURL(base)
          .then(() => {
            // resolve('打开成功');
          })
          .catch(() => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('暂无安装百度地图');
          });
      }
    });
  };

  static judgeOpenMap(index, slat, slon, sname, dlat, dlon, dname) {
    if (index === 0) {
      this.baiduNavigation(slat, slon, sname, dlat, dlon, dname);
    } else if (index === 1) {
      this.aMapNavigation(slat, slon, sname, dlat, dlon, dname);
    } else {
      this.qqMapNavigation(slat, slon, sname, dlat, dlon, dname);
    }
  }

  static baiduNavigation(slat, slon, sname, dlat, dlon, dname) {
    RoutePlan.isInstallBaiDuMap()
      .then((res) => {
        if (!res) {
          ToastUtil.center('请安装百度地图');
          return;
        }
        RoutePlan.openBaiDuMap({
          slat,
          slon,
          sname,
          dlat,
          dlon,
          dname,
          mode: RoutePlan.Mode.DRIVING
        })
          // eslint-disable-next-line no-alert
          .then((result) => alert(result))
          // eslint-disable-next-line no-alert
          .catch((err) => alert(err));
      })
      .catch((err) => this.alert(err));
  }

  static aMapNavigation(slat, slon, sname, dlat, dlon, dname) {
    RoutePlan.isInstallAmap()
      .then((res) => {
        if (!res) {
          ToastUtil.center('请安装高德地图');
          return;
        }
        RoutePlan.openAmap({
          slat,
          slon,
          sname,
          dlat,
          dlon,
          dname,
          mode: RoutePlan.Mode.DRIVING
        })
          // eslint-disable-next-line no-alert
          .then((result) => alert(result))
          // eslint-disable-next-line no-alert
          .catch((err) => alert(err));
      })
      .catch((err) => this.alert(err));
  }

  static qqMapNavigation(slat, slon, sname, dlat, dlon, dname) {
    RoutePlan.isInstallQQMap()
      .then((res) => {
        if (!res) {
          ToastUtil.center('请安装腾讯地图');
          return;
        }
        RoutePlan.openQQMap({
          slat,
          slon,
          sname,
          dlat,
          dlon,
          dname,
          mode: RoutePlan.Mode.DRIVING
        })
          // eslint-disable-next-line no-alert
          .then((result) => alert(result))
          // eslint-disable-next-line no-alert
          .catch((err) => alert(err));
      })
      .catch((err) => this.alert(err));
  }
}
