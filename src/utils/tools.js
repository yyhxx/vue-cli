// 百度地图获取当前定位
export function getPosition() {
    let geolocation = new BMap.Geolocation();
    return new Promise((resolve, reject) => {
        geolocation.getCurrentPosition(
            function(r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    var geoc = new BMap.Geocoder();
                    geoc.getLocation(r.point, function(rs) {
                        /**
                         * @param streetNumber	String	门牌号码
                         * @param street	String	街道名称
                         * @param district	String	区县名称
                         * @param city	String	城市名称
                         * @param province	String	省份名称
                         */
                        // 成功之后将返回值返回resolve
                        resolve({ point: r.point, address: rs.addressComponents });
                    });
                } else {
                    //错误之后将状态码返回给catch
                    reject(this.getStatus());
                }
            }, { enableHighAccuracy: true }
        );
    });

}
// 百度地图
/**
 * @export
 * @param {any} nodeId dom节点
 * @param {any} latitude 经度
 * @param {any} longitude 纬度
 * @returns 
 */
export function getMap(nodeId, latitude, longitude) {
    return new Promise(function(resolve, reject) {
        var map = new BMap.Map(nodeId); // 创建Map实例
        var point = new BMap.Point(latitude, longitude);
        map.centerAndZoom(point, 15);
        var marker = new BMap.Marker(point); // 创建标注
        map.addOverlay(marker);
    })
}

//路线规划

//验证身份证
export function checkID(ID) {
    let regExp = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
    return regExp.test(ID) ? true : false;
}

// 校验手机号
export function checkPhone(number) {
    let regExp = /^1\d{10}$/;
    return regExp.test(number) ? true : false;
}

// 校验密码强度
export function checkPwd(pwd) {
    let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    return regExp.test(pwd) ? true : false;
}

export function refreshPage() {
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
        // 替换成站标favicon路径或者任意存在的较小的图片即可
    iframe.setAttribute('src', '/favicon.ico')
    var iframeCallback = function() {
        setTimeout(function() {
            iframe.removeEventListener('load', iframeCallback)
            document.body.removeChild(iframe)
        }, 0)
    }
    iframe.addEventListener('load', iframeCallback)
    document.body.appendChild(iframe)
}

/* cookie的存取 start */
import Cookies from 'js-cookie'

export function setCookie(name, value) {
    return Cookies.set(name, value)
}
export function getCookie(name) {
    return Cookies.get(name)
}
export function delCookie(name) {
    return Cookies.remove(name)

}
/* cookie的存取 end */

/* 手机机型和环境判断 start */
export function isWechat() {
    let ua = window.navigator.userAgent.toLowerCase()
    return ua.match(/MicroMessenger/i) == 'micromessenger' ? true : false
}
export function isAndroid() {
    let ua = window.navigator.userAgent.toLowerCase()
    return ua.indexOf('android') > -1 ? true : false
}
export function isiOS() {
    let ua = window.navigator.userAgent.toLowerCase()
    return ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? true : false
}
/* 手机机型和环境判断 end */