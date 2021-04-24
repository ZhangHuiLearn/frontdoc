import Vue from 'vue'
import App from './App'

import {DataProxy} from "@/node_modules/cw-engine/lib/common/proxy/DataProxy";
import {Binder as binder} from "@/node_modules/cw-engine/lib/event/impl/PageBinder";
import {Context} from "@/node_modules/cw-engine/lib/common/GlobalCtx";
import {LogProxy as log} from "@/node_modules/cw-engine/lib/common/proxy/LogProxy";
import {EngineConf} from "@/node_modules/cw-engine/lib/common/EngineConfig";
import SystemConstant from "@/common/constant/SystemConstant";
import {ApiNative} from "@/node_modules/cw-engine/lib/common/native/ApiNativeImpl";
import {RemoteNative} from "@/node_modules/cw-engine/lib/common/native/RemoteNativeEvent";
import {DataKeys} from "@/common/constant/DataKeys"
import {StringUtils} from "@/node_modules/cw-engine/lib/utils/StringUtils"
import NativeXFrame from "@/uni-frame/NativeXFrame";
import AcdStarter from "./app/acd/frame/AcdStarter";
// 多语言设置
import VueI18n from 'vue-i18n';
import ch from '@/lang/ch';
import en from '@/lang/en';// 创建vue-i18n实例i18n
import uygur from '@/lang/uygur';
import components from './components';

Vue.use(components);

import dateUtils from './utils/dateUtils.js'

Vue.prototype.$dateUtils = dateUtils;

const dataOpt = DataProxy;
Vue.prototype.$api = {
    log,
    dataOpt,
    binder,
    SystemConstant
};

Vue.config.productionTip = false;
Vue.config.silent = true;

//多语言1111
Vue.use(VueI18n);// 引入各个语言配置文件
// 创建vue-i18n实例i18n
const i18n = new VueI18n({
// 设置默认语言
    locale: localStorage.getItem('locale') || 'ch', //语言标识
    messages: {
        ch,
        en,
        uygur
    },
    fallbackLocale: 'ch', //如果在message中找不到相应的键值将回退到原本的语言
    formatFallbackMessages: true //如果在message中找不到相应的键值将回退到原本的语言
})

App.mpType = 'app';
const app = new Vue({
    i18n,
    ...App
});
app.$mount();

console.log('process.env.NODE_ENV:' + process.env.NODE_ENV);
EngineConf.setLinkType('webSocket');
EngineConf.setWsUrl('ws://localhost:8888/');
Context.vm = app;

//windows 启动回调通知
//window.onCefBrowserLoadEnd = function () {
    EngineConf.setAppType('windows');
    Context.setContext({
        xframe: new NativeXFrame()
    });
    const acd = new AcdStarter();
    acd.initFrame();
    acd.start();
    /*dataOpt.getData(DataKeys.DURABLE_SYSTEM_TERMTYPE)
            .then(res => {
                let deviceType = res[DataKeys.DURABLE_SYSTEM_TERMTYPE];
                if (StringUtils.equalsIgnoreCase(deviceType, "acd")) {
                    const acd = new AcdStarter();
                    acd.initFrame();
                    acd.start();
                } else if (StringUtils.equalsIgnoreCase(deviceType, "znydt")) {
                    // start()
                }else if (StringUtils.equalsIgnoreCase(deviceType, "tdj")) {
                    // start()
                }
            }).catch(e => {
        alert(e);
    });*/
//};
window.onApiEvent = function (data) {
    ApiNative.fireApiCommandEvent(data);
};
window.onRemoteEvent = function (data) {
    RemoteNative.fireRemoteEvent(data);
};
