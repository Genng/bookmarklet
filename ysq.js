if (window._ysq) {    window._ysq = new GenshinInfoFetcher();} else {    var GenshinInfoFetcher = function () {        const ths = this;        document.body.innerHTML = '';        let div = document.createElement("div");        div.innerHTML = '<p>正在载入脚本中...请等待</p>';        document.body.prepend(div);        this.loadCss('https://cdn.bootcdn.net/ajax/libs/bulma/0.9.3/css/bulma.min.css');        this.loadScript('https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.min.js', function () {            ths.loadScript('https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.min.js', function () {                ths.loadScript('https://babalae.github.io/genshin-info/js/bh-render.js', function () {                    console.log('bh-render.js 加载完成');                    const ds = ths.getDS();                    const uid = prompt('请输入需要查询的uid');                    console.log('输入的uid: ' + uid);                    if (uid.length !== 9) {                        alert('请输入正确的uid！');                    }                    // fetch('https://api-takumi.mihoyo.com/game_record/card/wapi/getGameRecordCard?uid=', {                    //     method: 'GET',                    //     credentials: 'include',                    //     headers: ths.getHeaders(ds),                    // }).then(function (response) {                    //     return response.json();                    // }).then(function (json) {                    //     console.log(json);                    // });                    Promise.all([ths.queryBaseInfo(uid, ds), ths.queryAbyssInfo(uid, ds)]).then(values => {                        let baseInfoJson = values[0];                        let abyssInfoJson = values[1];                        if (baseInfoJson.retcode == 0) {                            console.log('查询成功，开始渲染结果');                            document.body.innerHTML = '';                            ths.renderInfo(uid + ' 查询成功', baseInfoJson, abyssInfoJson);                            console.log('渲染完成');                        } else if (baseInfoJson.retcode == -1) {                            alert('查询无结果，可能造成这种情况的原因：1.UID不存在 2.没有在米游社同步并公开角色信息');                        } else {                            alert('查询失败！' + baseInfoJson.message);                        }                    }).catch(err => {                        alert('查询失败！' + err);                    });                });            });        });    };    GenshinInfoFetcher.prototype = {        loadScript: function (url, callback) {            const script = document.createElement('script');            script.type = 'text/javascript';            if (script.readyState) {                script.onreadystatechange = function () {                    if (script.readyState === 'loaded' || script.readyState === 'complete') {                        script.onreadystatechange = null;                        callback();                    }                }            } else {                script.onload = function () {                    callback();                }            }            script.src = url;            document.body.append(script);        },        loadCss: function (url) {            let head = document.getElementsByTagName('head')[0];            let link = document.createElement('link');            link.type = 'text/css';            link.rel = 'stylesheet';            link.href = url;            head.appendChild(link);        },        randomString: function (length) {            let result = "";            let characters = "abcdefghijklmnopqrstuvwxyz0123456789";            let charactersLength = characters.length;            for (let i = 0; i < length; i++) {                result += characters.charAt(Math.floor(Math.random() * charactersLength));            }            return result;        },        getDS: function () {            let n = 'w5k9n3aqhoaovgw25l373ee18nsazydo';            let i = new Date().getTime().toString().substr(0, 10);            let r = this.randomString(6)            let c = md5('salt=' + n + '&t=' + i + '&r=' + r)            return i + ',' + r + ',' + c        },        getHeaders: function (ds) {            return {                'Accept': 'application/json, text/plain, */*',                'DS': ds,                'x-rpc-app_version': '2.9.0',                'x-rpc-client_type': '5',                'Accept-Encoding': 'gzip, deflate',                'Accept-Language': 'zh-CN,en-US;q=0.8',                'X-Requested-With': 'com.mihoyo.hyperion',            }        },        getServer: function (uid) {            let f = uid.substring(0, 1);            if (f === '5') {                return 'cn_qd01'            } else {                return 'cn_gf01'            }        },        queryBaseInfo: function (uid, ds) {            return new Promise((resolve, reject) => {                fetch('https://api-takumi.mihoyo.com/game_record/genshin/api/index?server=' + this.getServer(uid) + '&role_id=' + uid, {                    method: 'GET',                    credentials: 'include',                    headers: this.getHeaders(ds),                }).then(res => res.json()).then(json => {                    resolve(json)                }).catch(function (e) {                    reject(e)                })            })        },        queryAbyssInfo: function (uid, ds) {            return new Promise((resolve, reject) => {                fetch('https://api-takumi.mihoyo.com/game_record/genshin/api/spiralAbyss?schedule_type=1&server=' + this.getServer(uid) + '&role_id=' + uid, {                    method: 'GET',                    credentials: 'include',                    headers: this.getHeaders(ds),                }).then(res => res.json()).then(json => {                    resolve(json)                }).catch(function (e) {                    reject(e)                })            })        },        renderInfo: function (msg, baseInfoJson, abyssInfoJson) {            const panel = '<div id="app"><genshin-info-render :msg="msg" :base-info="baseInfo.data" :abyss-info="abyssInfo.data"></genshin-info-render></div>';            let div = document.createElement("div");            div.innerHTML = panel;            document.body.prepend(div);            let app = new Vue({                el: '#app',                data: {                    baseInfo: baseInfoJson,                    abyssInfo: abyssInfoJson,                    msg: msg,                }            })        },    };    window._ysq = new GenshinInfoFetcher();}