import _storage from 'good-storage';
const hostInfoKey = 'HOST_DATA'
const configKey = 'VMC_CONFIG'
const dataKey = 'VMC_PDU_DATA'
const curHostIdKey = 'CUR_HOST_ID'

export default {
	// 清除全部缓存数据
	clear: () => {
		_storage.clear()
	},

	setHostData: (data) => {
		_storage.set(hostInfoKey, data)
	},

	getHostData: () => _storage.get(hostInfoKey),

	setVmcConfig: config => _storage.set(configKey, config),
	getVmcConfig: config => _storage.get(configKey),
	
	// 存储所有主机数据，供其他页面使用
	setVmcPduData: data => _storage.set(dataKey, data),
	getVmcPduData: data => _storage.get(dataKey),
	
	// 存储当前已激活的主机ID，供其他页面使用
	setCurHostData: id => _storage.set(curHostIdKey, id),
	getCurHostData: _ => _storage.get(curHostIdKey),
	removeCurHostId: _ => _storage.remove(curHostIdKey)
}
