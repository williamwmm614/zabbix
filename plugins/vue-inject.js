/**
 * vue-inject
 * 将内容注入 Vue 实例，避免重复引入，在 Vue 原型上挂载注入一个函数，所有组件内都可以访问(不包含服务器端)。
 */

import Vue from 'vue'
import DayJs from 'dayjs'
import Storage from '../utils/storage'

Vue.prototype.$storage = Storage

Vue.prototype.$apis = {
	config: '/api/zabbix/config',
	topology: '/api/zabbix/hosts',
	vmc: '/api/udp/vmcs',
	rtu: '/api/udp/rtus',
	host: '/api/zabbix/histories',
	track: '/api/udp/vmcs/xyz',
	trackTest: '/api/udp/vmcs/xyz/generate',
	xcjGzmn: '/api/udp/hostInstruct?host=RTU-1',
	fqjGzmn: '/api/udp/partitionInstruct?host=RTU-1&partition=2',
	computerGzmn: '/api/udp/taskInstruct?host=RTU-1&partition=2&task=3',
	hostMerge: '/api/udp/hostMerge'
}

Vue.prototype.$replaceStr = (str, newStr, oldStr = 'VMC') => {
	return str.replaceAll(oldStr, newStr)
};

// 日期格式化
Vue.prototype.$dateFormat = (date, formatVal = 'YYYY-MM-DD HH:mm:ss') => {
	if (date) return DayJs(date).format(formatVal);
	return '';
};

Vue.prototype.$formatSecondsTime = (time) => {
	if (time === '') return
	let daySec = 24 * 60 * 60;
	let hourSec = 60 * 60;
	let minuteSec = 60;
	let dd = Math.floor(time / daySec);
	let hh = Math.floor((time % daySec) / hourSec);
	let mm = Math.floor((time % hourSec) / minuteSec);
	let ss = time % minuteSec;
	let result = ''

	if (dd > 0) {
		result = `${dd}天${hh}小时${mm}分钟${ss}秒`
	} else if (hh > 0) {
		result = `${hh}小时${mm}分钟${ss}秒`
	} else if (mm > 0) {
		result = `${mm}分钟${ss}秒`
	} else {
		result = `${ss}秒`
	}

	return result
}
