import _storage from 'good-storage';
const hostInfoKey = 'HOST_DATA'
const configKey = 'VMC_CONFIG'
const dataKey = 'VMC_PDU_DATA'
const curHostIdKey = 'CUR_HOST_ID'
const vmcPartitionKey = 'VMC_PARTITION_AMOUNT'
const vmcTaskKey = 'VMC_TASK_AMOUNT'
const emulatedDataKey = 'be_emulated_data' // 被模拟的数据 包括：主机ID，分区下标，任务下标

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
	removeCurHostId: _ => _storage.remove(curHostIdKey),
	
	setVmcPartition: data => _storage.set(vmcPartitionKey, data),
	getVmcPartition: data => _storage.get(vmcPartitionKey),
	setVmcTask: data => _storage.set(vmcTaskKey, data),
	getVmcTask: data => _storage.get(vmcTaskKey),
	
	// 存储需被模拟的主机数据
	setEmulatedData: data => _storage.set(emulatedDataKey, data),
	getEmulatedData: _ => _storage.get(emulatedDataKey),
	removeEmulatedData: _ => _storage.remove(emulatedDataKey)
}
