/**
 * 判断字符串是否是https?:|mailto:|tel: 开头的
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}
//  用户名验证规则,假数据暂定为[admin,editor]
export function validUsername(str) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
}

//  检验是否是数字
export function isNumberStr(str) {
    return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}

//  手机号正则验证
export function isPhone(str) {
    return /^[1][2,3,4,5,7,8,9][0-9]{9}$/.test(str)
}

//  手机号正则验证
export function isAmericaPhone(str) {
    return /^[1-9][0-9]{9}$/.test(str)
}

//  美国地址正则验证(中文匹配)

export function isAmericaAddress(str) {
    return /[\u4e00-\u9fa5]/g.test(str)
}

//  美国城市名正则验证

export function isAmericaCity(str) {
    return /(^|\s)[a-zA-Z',.-\s]{1,25}(?=\s|$)((?!\W)[a-zA-Z',.-\s]{1,25}(?=\s|$))?/.test(str)
}

//  缴纳金额
export function isMoney(str) {
    return /^[1-9][0-9]{0,8}$/.test(str)
}

//  50位数字
export function is50Number(str) {
    return /^[0-9]{1,50}$/.test(str)
}

//  100位数字
export function is100Number(str) {
    return /^[0-9]{1,100}$/.test(str)
}

//  中英文名字

export function isName(str) {
    return /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/.test(str)
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
    if (typeof Array.isArray === 'undefined') {
        return Object.prototype.toString.call(arg) === '[object Array]'
    }
    return Array.isArray(arg)

}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function isEmail(email) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(email)
}


//  微信
export function isWeChat(str) {
    const reg = /^[a-zA-Z][a-zA-Z\d_-]{5,19}$/
    return reg.test(str)
}

//  英文城市正则验证
export function isEngLishName(str) {
    const reg = /^[a-zA-Z\s]{1,30}$/
    return reg.test(str)

}


//  职位
export function isPosition(position) {
    const reg = /^[\u4E00-\u9FA5A-Za-z].{2,20}$/
    return reg.test(position)
}

//  中文名称
export function isChineseTitle(str) {
    const reg = /^[\u4e00-\u9fa5].{1,6}$/
    return reg.test(str)
}

// 验证名称字符长度
export const validateName = (value, min = 4, max = 60) => {

    if (!value || value === null) return false
    var len = 0;
    for (var i = 0; i < value.length; i++) {
        var c = value.charCodeAt(i);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        } else {
            len += 2;
        }
    }
    if ((len < min && len > 0) || len > max) {
        return false
    } else {
        return true
    }
};
//  验证名称字符长度表单
export const validateNameForm = (min = 4, max = 60) => {
    return (rule, value, callback) => {
        let res = validateName(value, min, max)
        if (res === false) {
            callback(new Error(`请输入${min / 2}-${max / 2}个汉字(${min}-${max}字符).`));
        } else {
            callback();
        }
    };
}

// 验证中文输入数量
export const isChineseNum = (str, minLength = 1, maxLength = 10) => {
    const reg = new RegExp(`^[\\u4e00-\\u9fa5]{${minLength},${maxLength}}$`)
    return reg.test(str)
}

// 佣金抽取率，可选小数点后两位，只可输入数字
export function isDecimalFraction(str) {
    const reg = /^\d+(\.\d{1,2})?$/
        // const reg = /^100(.00)?|([1-9]?[0-9])(\.[0-9]{2})?$/
    return reg.test(str)
}