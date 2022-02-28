Date.prototype.format = function (format) {
    let o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

axios.defaults.baseURL = "http://ai-inori.top/api";
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.crossDomain=true;

axios.interceptors.request.use(function (config) {
    let inori_token = inori.cookie.get("INORI_TOKEN");
    if (inori_token !== null && inori_token !== "" && inori_token !== "undefined") {
        config.headers['Authorization'] = "Bearer " + inori_token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 配置对象
const inori = blog = {

    /**
     * 发起ajax请求工具，底层依然是axios
     */
    http: axios,
    store: {
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get(key) {
            return JSON.parse(localStorage.getItem(key));
        },
        del(key) {
            return localStorage.removeItem(key);
        }
    },
    cookie: {
        set(name, value) {
            document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(encodeURIComponent(value)) + ";path=/";
        },
        get(name) {
            let arrStr = document.cookie.split("; ");
            for (let i = 0; i < arrStr.length; i++) {
                let temp = arrStr[i].split("=");
                if (temp[0] === name) return unescape(temp[1]);  //解码
            }
            return "";
        }
    },
    /**
     * 将日期格式化为指定格式
     * @param val
     * @param pattern
     * @returns {null}
     */
    formatDate(val, pattern) {
        if (!val) {
            return null;
        }
        if (!pattern) {
            pattern = "yyyy-MM-dd hh:mm:ss"
        }
        return new Date(val).format(pattern);
    }
};
