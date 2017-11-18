
var updatetime=10;//单位分钟
// 数据异常搜集
var setBugReport=function(code,msg,file) {
    // console.log('日志文件准备');
    if (file==undefined || file=='') {
        file=pageNameFull();
    }
    var appVersion=api.appVersion;
    var deviceId = api.deviceId;
    var userInfo = $api.getStorage('userInfo');
    var uid=0;
    if (userInfo) {
        var uid=userInfo.userId;
    }
    if (code && msg) {
        // 上报错误
        var date=getCurrentDate();
        // 先读取原来的日志文件，然后累加，再写入
        var logfile='fs://log.txt';
        var oldMsg='';
        api.readFile({
            path: logfile
        }, function(ret, err) {
            if (ret.status) {
                oldMsg = ret.data;
                console.log('日志文件：'+logfile+" ，读取成功");
            } else {
                alert(err.msg);
                console.log('日志文件：'+logfile+" ，读取失败");
            }
        });
        var _msg="\n\rdate："+date+'，file：'+file+'，用户id：'+uid+'，code：'+code+'，deviceId：'+deviceId+'，appVersion：'+appVersion;
        if (oldMsg) {
            msg+=oldMsg;
        }
        console.log('日志文件：'+logfile+" ，参数："+JSON.stringify(msg));
        api.writeFile({
            path: logfile,
            data: msg
        }, function(ret, err) {
            if (ret.status) {
                console.log('日志文件：'+logfile+" ，写入成功");
                //成功
            } else {
                console.log('日志文件：'+logfile+" ，写入失败");
            }
        });
        console.log('日志文件结束：'+logfile);
    }
}

var setCacheData=function(name,data,time){

}


// 上报本地错误日志文件
var uploadLog=function() {
    api.ajax({
            url: 'http://api.isimida.cn/?service=App.Courier_Status.SetStatus&'+params,
            method: 'get'
        }, function(ret, err) {
            if (ret.ret=200) {
                // 更新在线状态成功,
                $api.setStorage('userstatus', 1);
                $api.rmStorage('setLocationTime');
                api.toast({
                    msg: '状态更新成功'
                });
            } else {
                // alert(JSON.stringify(ret));
            }
        });
}

// 取当前页面名称(不带后缀名)
var pageName=function()
{
    var a = location.href;
    var b = a.split("/");
    var c = b.slice(b.length-1, b.length).toString(String).split(".");
    return c.slice(0, 1);
}

//取当前页面名称(带后缀名)
var pageNameFull=function()
{
    var strUrl=location.href;
    var arrUrl=strUrl.split("/");
    var strPage=arrUrl[arrUrl.length-1];
    return strPage;
}

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
                $api.rmStorage('setLocationTime');
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

//打开菜单
function sliding() {
    api.openSlidPane({type: 'left'});
}

// 打开关于Window
function fnOpenAboutWin () {
    api.openWin({
        name: 'about',
        url: './about.html'
    });
}

// 打开个人中心，如果没有登录则先登录；否则进入个人中心
var fnOpenPersonalCenterWin=function() {
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

// 打开登录界面
function fnOpenLogin() {
    api.openWin({
        name: 'login',
        url: './login.html',
        pageParam: {
            name: 'test'
        }
    });
}

// 进入主界面
var fnMain=function(){
    console.log('fnMain 被执行了');
    api.openSlidLayout({
        type: 'left',
        leftEdge: 60,
        fixedPane: {
            name: 'memu',
            url: 'memu.html'
        },
        slidPane: {
            name: 'main',
            url: 'main.html'
        }
    }, function (ret) {

    });
}

// 完成操作刷新主界面并且返回
var fnfreshMain=function() {
    console.log("页面操作完成，返回主页刷新一下！");
    api.execScript({
        name: 'main',
        frameName: 'main_index',
        script: 'getTodayOrderList();'
    });
    api.closeWin();
    console.log("页面操作完成，返回主页刷新结束！");
}

function fnShowMessage(msg,func) {
    api.alert({
        title: '提示',
        msg: msg,
    }, function(ret, err) {
        // alert(JSON.stringify(ret));
        console.log('fnShowMessage,'+msg+" "+JSON.stringify(ret));
        if (ret) {
            func();
        }
    });
}



//未开通功能提示
function fnNoOpen() {
    var time=getCurrentTime();
    var currentCity = $api.getStorage('currentCity');
    var setLocationTime = $api.getStorage('setLocationTime');
    if (!currentCity) {
        currentCity={'name':'未定义'};
    }
    api.toast({
        msg: '该功能暂未开通,当前城市:'+currentCity.name
        // msg: '当前时间：'+time+",\n上次执行时间："+setLocationTime
    });
}
// 该功能暂未开通,


// 取当前系统X小时X分钟
var getCurrentTime=function(){
    var oDate = new Date();
    var hour=oDate.getHours();
    var minutes=oDate.getMinutes();
    var time2=hour+':'+minutes;
    hour=parseInt(hour)*60;
    return hour+parseInt(minutes);
}

// 取当前系统X小时X分钟
var getCurrentDate=function(){
    var oDate = new Date();
    var hour=oDate.getHours();
    var minutes=oDate.getMinutes();
    return oDate+':'+hour+':'+minutes;
}


var isUpdateFlag=function(time) {
    var time0=getCurrentTime();
    if (time) {
        // 比较两个时间，看看是否超过了设定时间updatetime
        _time=updatetime*60;
        // console.log("原来的时间戳："+time+"，现在的时间戳："+time2+"，设定更新的秒数："+_time);
        ctime=time0-time;
        // console.log("截取后的，原来的时间戳："+time0+"，现在的时间戳："+time2+"，设定更新的秒数："+_time);
        // console.log("算出来的差值："+ctime);
        if (_time<ctime) {
            return true;
        }
    }
    return false;
}

//提交用户当前位置，作为轨迹数据
function fnUpdateLocation() {
    // 加载百度地图模块
    var userInfo = $api.getStorage('userInfo');
    if (!userInfo) {
        return false;
    }
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
        return false;
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

function getMyDate(str){ 
    var now = new Date(str),
    y = now.getFullYear(),
    m = now.getMonth() + 1,
    d = now.getDate();
return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d); 
// return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8); 
}

// 金额统一除以100，还原成真实的金额
var getMoney=function(number) {
    return Math.round(number/100);
}

// 距离统一除以1000，还原成真实的距离
var getDistance=function(number) {
    return Math.round(number/1000);
}

// 初始化订单状态列表
var getStautsList=function() {
    var _orderaction = $api.getStorage('recordStatus');
    if (!_orderaction.data) {
        flag=true;
    }else{
        flag=isUpdateFlag(_orderaction.time);
    }
    if (!flag) {
        setUpdateCache('recordStatus');
    }
    if (flag) {
        console.log("获取订单状态列表");
        api.ajax({
            url: 'http://api.isimida.cn/?service=App.Courier_Order.GetOrderStatusList',
            timeout: 30
        }, function(ret, err) {
            // console.log("获取订单状态列表,返回值：ret="+JSON.stringify(ret));
            var rets=ret.data;
            if (ret.ret==200) {
                var time=getCurrentTime()
                var data={
                    data:rets,
                    time:time
                };
                if (rets) {
                    $api.setStorage('recordStatus',data);
                }
                return rets;
            } else {
                return;
                // alert(JSON.stringify(ret));
            }
        });
    }
}

// 获取指定缓存更新状态
var setUpdateCache=function(action,data) {
    if (data==undefined || data=='') {data='';}
    console.log("获取指定缓存更新状态:");
    if (action) {
        api.ajax({
            url: 'http://api.isimida.cn/?service=App.Courier_Cache.GetStatus&action='+action,
            timeout: 30
        }, function(ret, err) {
            console.log("获取指定缓存更新状态,返回值：ret="+JSON.stringify(ret));
            var rets=ret.data;
            if (ret.ret==200) {
                if (rets.is_delete>0) {
                    $api.rmStorage(action);
                    console.log(action+"的缓存被删除");
                }
                if (data!='') {
                    if (rets.must_update>0) {
                        $api.setStorage(action,data);
                        console.log(action+"的缓存被强制更新，更新后数据："+JSON.stringify(data));
                    }
                }
            }
        });
    }
}

// 读取订单对应状态描述
var getStatus=function(num,type) {
    if (type==undefined || type=='') {type='name';}
    
    var recordStatus=$api.getStorage('recordStatus');
    console.log("订单对应状态描述="+JSON.stringify(recordStatus));
    if (recordStatus) {
        // 根据对应值变成对应字符
        for (i in recordStatus){
            if(recordStatus[i].code==num){
                var res='';
                switch(type) {
                    case 'name':
                        res=recordStatus[i].name;
                        break;
                    case 'action':
                        res=recordStatus[i].action;
                        break;
                    case 'next_name':
                        res=recordStatus[i].next_name;
                        break;
                    case 'next_code':
                        res=recordStatus[i].next_code;
                        break;
                    default:
                        break;
                }
                return res;
            }
        }
        return '未知';
    }else{
        var statuslist={
                0:{
                "name": "待支付",
                "code": "10",
                "next_name": null,
                "next_code": null,
                "action": null
            },
            1:{
                "name": "已支付",
                "code": "20",
                "next_name": null,
                "next_code": null,
                "action": null
            },
            2:{
                "name": "已派单",
                "code": "30",
                "next_name": "致电寄方",
                "next_code": "40",
                "action": "callfrom"
            },
            3:{
                "name": "致电寄方",
                "code": "40",
                "next_name": "已到位",
                "next_code": "50",
                "action": "byplace"
            },
            4:{
                "name": "已到位",
                "code": "50",
                "next_name": "取件",
                "next_code": "60",
                "action": "checkpickup"
            },
            5:{
                "name": "已取件",
                "code": "60",
                "next_name": "致电收方",
                "next_code": "70",
                "action": "callto"
            },
            6:{
                "name": "致电收方",
                "code": "70",
                "next_name": "签收",
                "next_code": "",
                "action": "checkreceive"
            },
            7:{
                "name": "已完成",
                "code": "80",
                "next_name": null,
                "next_code": "100",
                "action": ""
            },
            8:{
                "name": "已取消",
                "code": "100",
                "next_name": null,
                "next_code": null,
                "action": ""
            }
        };
        $api.setStorage('recordStatus',statuslist);
       // console.log("1111订单对应状态描述="+JSON.stringify(recordStatus));
       // getStautsList();
       if (num) {
           return getStatus(num,type);
       }
    }
}