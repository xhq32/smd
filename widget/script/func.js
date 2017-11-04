
//设置当前用户为在线状态
function setOnStatus() {
    var deviceId = api.deviceId;
    var userInfo = $api.getStorage('userInfo');
    if (userInfo) {
        var params='user_id='+userInfo.userId+'&status=1&deviceId='+deviceId;
        api.ajax({
            url: 'http://api.isimida.cn/?service=App.Courier_Status.SetStatus&'+params,
            method: 'get'
        }, function(ret, err) {
            if (ret.ret=200) {
                // 更新在线状态成功,
                $api.setStorage('userstatus', 1);
                api.toast({
                    msg: '状态更新成功'
                });
            } else {
                // alert(JSON.stringify(ret));
            }
        });
    }
}

//设置当前用户为离线状态
function setOffStatus() {
    var deviceId = api.deviceId;
    var userInfo = $api.getStorage('userInfo');
    var params='user_id='+userInfo.userId+'&status=0&deviceId='+deviceId;
    api.ajax({
        url: 'http://api.isimida.cn/?service=App.Courier_Status.SetStatus&'+params,
        method: 'get'
    }, function(ret, err) {
        if (ret.ret=200) {
            // 更新在线状态成功,
            $api.rmStorage('userstatus');
            $api.rmStorage('setLocationTime');
        } else {
            // alert(JSON.stringify(ret));
        }
    });
}

// 打开设置Window
function fnOpenSettingWin () {
    api.openWin({
        name: 'setting',
        url: './setting.html'
    });
}

// 打开消息Window
function fnOpenMessageWin () {
    api.openWin({
        name: 'message',
        url: './message.html'
    });
}

// 打开个人中心，如果没有登录则先登录；否则进入个人中心
function fnOpenPersonalCenterWin() {
    // 从缓存中获取用户信息
    var userInfo = $api.getStorage('userInfo');

    // 判断当前用户是否登录了
    if (userInfo && userInfo.userId) {
        // 登录成功，打开个人中心Window
        api.openWin({
            name: 'personalcenter',
            url: './personalcenter.html',
            pageParam: {
                name: 'test'
            }
        });
    } else {
        // 没有登录，打开登录Window
        api.openWin({
            name: 'login',
            url: './login.html',
            pageParam: {
                name: 'test'
            }
        });
    }
}

// 打开客服Window
function fnOpenCustomerServiceWin () {
    fnNoOpen();
    // api.openWin({
    //     name: 'customerservice',
    //     url: './customerservice.html'
    // });
}
// 常见问题
function fnOpenCommnoQuestionWin () {
    fnNoOpen();
    // api.openWin({
    //     name: 'customerservice',
    //     url: './customerservice.html'
    // });
}
// 私密达手册
function fnOpenHandbookWin () {
    fnNoOpen();
    // api.openWin({
    //     name: 'customerservice',
    //     url: './customerservice.html'
    // });
}

// 通知
function fnOpenNoticeWin () {
    fnNoOpen();
    // api.openWin({
    //     name: 'customerservice',
    //     url: './customerservice.html'
    // });
}

// 离线地图
function fnOpenOfflineMapWin () {
    fnNoOpen();
    // api.openWin({
    //     name: 'customerservice',
    //     url: './customerservice.html'
    // });
}

//未开通功能提示
function fnNoOpen() {
    var time=getCurrentTime();
    var setLocationTime = $api.getStorage('setLocationTime');
    api.toast({
        msg: '该功能暂未开通'
        // msg: '当前时间：'+time+",\n上次执行时间："+setLocationTime
    });
}
// 该功能暂未开通,


// 取当前系统X小时X分钟
function getCurrentTime(){
    var oDate = new Date();
    var hour=oDate.getHours();
    var minutes=oDate.getMinutes();
    var time2=hour+':'+minutes;
    hour=parseInt(hour)*60;
    return hour+parseInt(minutes);
}

//提交用户当前位置，作为轨迹数据
function fnUpdateLocation() {
    // 加载百度地图模块
    var userInfo = $api.getStorage('userInfo');
    var setLocationTime = $api.getStorage('setLocationTime');
    setLocationTime=setLocationTime>0?setLocationTime:0;
    var time=getCurrentTime();
    var ctime=parseInt(setLocationTime)+15;
    if (ctime>time) {
        // api.toast({
        //     msg: "当前检查情况,\n上次记录时间:"+setLocationTime+"\n,上次+差值的时间:"+ctime+',现在时间:'+time,
        //     duration: 10000,
        //     location: 'middle'
        // });
        return '';
    }
    if (userInfo.userId>0) {
        bMap = api.require('bMap');

        // 获取当前经纬度
        bMap.getLocation({
            accuracy: '1000m', // 定位所在城市信息，不需要精准定位
            autoStop: true, // 定位到经纬度后，立即自动停止定位服务
            filter: 100000 // 基本无需处理位置更新的情况
        }, function(ret, err) {
            if (ret.status) {
                // 组合上传当前经纬度
                var lon=ret.lon;
                var lat=ret.lat;
                params = 'longitude='+lon+'&dimension='+lat+'&user_id='+userInfo.userId;
                api.ajax({
                    url: 'http://api.isimida.cn/?service=App.Courier_User.Location&'+params,
                    method: 'get'
                }, function(rets, err) {
                    // alert(JSON.stringify(rets));
                    if (rets.ret==200) {
                        //记录本次执行的时间，方便下次比对
                        var time=getCurrentTime();
                        $api.setStorage('setLocationTime', time);
                        // 保存用户信息
                        // $api.setStorage('userInfo', rets.data);
                        // setOnStatus();
                        // api.alert({
                        //     title: '提示',
                        //     msg: '登录成功',
                        // }, function(ret, err) {
                        //     // alert(JSON.stringify(ret));
                        //     if (ret) {
                        //         api.closeWin();
                        //     }
                        // });
                    } else {
                        // alert(JSON.stringify(ret));
                        // api.toast({
                        //     msg: '登录失败，手机号或密码错误',
                        //     duration: 2000,
                        //     location: 'middle'
                        // });
                    }
                });
                
            } else {
                alert(err.code);
            }
        });
    }else{
        alert('没有会员数据');
    }
}

