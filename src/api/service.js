import http from '@/utils/request';

/**
 * 发送GET请求
 * @param {string} url - 请求URL
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回一个Promise对象
 */
const get = (url, params) => {
    return http.get(url, { params });
};

/**
 * 发送POST请求
 * @param {string} url - 请求URL
 * @param {Object} data - 请求体数据
 * @returns {Promise} - 返回一个Promise对象
 */
const post = (url, data) => {
    return http.post(url, data);
};

/**
 * 发送PUT请求
 * @param {string} url - 请求URL
 * @param {Object} data - 请求体数据
 * @returns {Promise} - 返回一个Promise对象
 */
const put = (url, data) => {
    return http.put(url, data);
};

/**
 * 发送DELETE请求
 * @param {string} url - 请求URL
 * @param {Object} data - 请求体数据
 * @returns {Promise} - 返回一个Promise对象
 */
const del = (url, data) => {
    return http.delete(url, { data });
};

//获取园区列表
export const getParkOperationList = (params) => {
    return get('/base/park/list', params);
};

//新增园区
export const addPark = (params) => {
    return post('/base/park/save', params);
};

//修改园区
export const updatePack = (params) => {
    return put("/base/park/update", params);
}

//删除园区列表
export const deletePark = (id) => {
    return del(`/base/park/delete/${id}`);
};

//获取预览信息
export const getPreviewInfo = (id) => {
    return get(`/base/park/preview/${id}`);
};

//获取客户群体列表
export const getCustomerGroupList = (params) => {
    return get('/base/parkCustomer/list', params);
};

//新增面向客户群体
export const addCustomerGroup = (params) => {
    return post('/base/parkCustomer/save', params);
};

//修改面向客户群体
export const updateCustomerGroup = (params) => {
    return put("/base/parkCustomer/update", params);
}

//删除面向客户群体
export const deleteCustomerGroup = (id) => {
    return del(`/base/parkCustomer/delete/${id}`);
};

//获取案例列表
export const getCaseList = (params) => {
    return get('/base/parkCase/list', params);
};

//新增案例
export const addCase = (params) => {
    return post('/base/parkCase/save', params);
};

//修改案例
export const updateCase = (params) => {
    return put("/base/parkCase/update", params);
}

//删除案例
export const deleteCase = (id) => {
    return del(`/base/parkCase/delete/${id}`);
};


//获取区域优势列表
export const getRegionAdvantageList = (params) => {
    return get('/base/parkCaseArea/list', params);
};

//新增区域优势
export const addRegionAdvantage = (params) => {
    return post('/base/parkCaseArea/save', params);
};

//修改区域优势
export const updateRegionAdvantage = (params) => {
    return put("/base/parkCaseArea/update", params);
}

//删除区域优势
export const deleteRegionAdvantage = (id) => {
    return del(`/base/parkCaseArea/delete/${id}`);
};

//案例详情
export const getCaseDetail = (id) => {
    return get(`/base/parkCase/preview/${id}`);
};

//获取区域优势列表
export const getServiceAdvantageList = (params) => {
    return get('/base/parkCaseService/list', params);
};

//新增服务优势
export const addServiceAdvantage = (params) => {
    return post('/base/parkCaseService/save', params);
};

//修改服务优势
export const updateServiceAdvantage = (params) => {
    return put("/base/parkCaseService/update", params);
}

//删除服务优势
export const deleteServiceAdvantage = (id) => {
    return del(`/base/parkCaseService/delete/${id}`);
};


//获取产业服务列表
export const getIndustryList = (params) => {
    return get('/base/Service/listIndustry', params);
};

//新增产业服务
export const addIndustry = (params) => {
    return post('/base/Service/addIndustry', params);
};

//修改产业服务
export const updateIndustry = (params) => {
    return post("/base/Service/updateIndustry/", params);
}

//删除产业服务
export const deleteIndustry = (id) => {
    return del(`/base/Service/deleteIndustry/${id}`);
};


//获取企业服务列表
export const getServiceList = (params) => {
    return get('/base/Service/listEnter', params);
};

//新增企业服务
export const addService = (params) => {
    return post('/base/Service/addEnter', params);
};

//修改企业服务
export const updateService = (params) => {
    return post("/base/Service/updateEnter/", params);
}

//删除企业服务
export const deleteService = (id) => {
    return del(`/base/Service/deleteEnter/${id}`);
};

//获取方案数据
export const getCaseInfo = () => {
    return get('/base/PlanCounsel/query');
};

//设置方案
export const updateScheme = (params) => {
    return post("/base/PlanCounsel/set", params);
}

//获取服务类型数据
export const getServiceTypeInfo = () => {
    return get('/base/planCounselService/typeQuery');
};

//设置服务类型
export const updateServiceType = (params) => {
    return post("/base/planCounselService/setType", params);
}

//获取服务内容数据
export const getServiceContentInfo = () => {
    return get('/base/planCounselService/contentQuery');
};

//设置服务内容类型
export const updateServiceContent = (params) => {
    return post("/base/planCounselService/setContent", params);
}


//获取服务案例列表
export const getServiceCaseList = (params) => {
    return get('/base/case/query', params);
};

//新增服务案例
export const addServiceCase = (params) => {
    return post('/base/case/add', params);
};

//修改服务案例
export const updateServiceCase = (params) => {
    return post("/base/case/update", params);
}

//删除服务案例
export const deleteServiceCase = (id) => {
    return del(`/base/case/delete/${id}`);
};