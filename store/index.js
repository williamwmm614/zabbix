export const state = () => ({
	curVmcId: 0,
	hostActivated: 0,
	curHostId: 0,
	hostIsEnd: false,
	interactionParentModuleName: 'HOME', // 交互体验区主模块名称，为空时只显示原拓扑图和轮播图
	isBackToHome: false,
	vmcPartitionCount: 0, // VMC分区数
	vmcTaskCount: 0, // VMC任务数
})

export const mutations = {
	set_is_backToHome: (state, value) => {
		state.isBackToHome = value
	},

	// 存储交互体验区主模块名称
	set_interaction_parent_module_name: (state, name) => {
		state.interactionParentModuleName = name
	},

	// 设置当前VMC的ID
	set_cur_vmc_id: (state, id) => {
		state.curVmcId = id
	},

	// 设置当前激活主机下标
	set_host_activated: (state, value) => {
		state.hostActivated = value
	},

	// 设置当前激活主机的ID
	set_cur_host_id: (state, id) => {
		state.curHostId = id
	},
	
	// 主机轮询是否结束
	set_host_is_end: (state, value) => {
		state.hostIsEnd = value
	},

	set_cur_pdu_id: (state, id) => {
		state.curPduId = id
	},
	
	// 设置 VMC 分区数
	set_vmc_partition_count: (state, value) => {
		state.vmcPartitionCount = value
	},
	
	// 设置 VMC 任务数
	set_vmc_task_count: (state, value) => {
		state.vmcTaskCount = value
	}
}

export const getters = {
	IS_BACK_TO_HOME: state => state.isBackToHome,
	INTERACTION_PARENT_MODULE_NAME: state => state.interactionParentModuleName,

	CUR_VMC_ID: state => state.curVmcId,

	HOST_ACTIVATED: state => state.hostActivated,
	CUR_HOST_ID: state => state.curHostId,
	HOST_IS_END: state => state.hostIsEnd,
	
	VMC_PARTITON_COUNT: state => state.vmcPartitionCount,
	VMC_TASK_COUNT: state => state.vmcTaskCount,
}
