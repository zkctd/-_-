import http from "@/utils/request";

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

// GET
export const userList = (params) => {
  return get("users/userList/", params);
};

export const userInfos = (id) => {
  return get(`users/userInfo/${id}`);
};

export const downloadFile = (params) => {
  return get(`users/download/${params}`);
};

export const questionsList = (params) => {
  return get("/questions", params);
};

export const questionsDetail = (params) => {
  return get("/questions/detail", params);
};

export const questionsExport = () => {
  return get("/questions/export", {
    responseType: "blob",
  });
};

export const paperList = (params) => {
  return get("/papers/", params);
};

export const papersDetail = (params) => {
  return get("/papers/detail/", params);
};

export const examPaperList = (params) => {
  return get("/exams/getPaperList", params);
};

export const examList = (params) => {
  return get("/exams/", params);
};

export const dpartList = (params) => {
  return get("/departs/getDpartList/", params);
};

export const examDetail = (params) => {
  return get("/exams/detail", params);
};

export const allUserList = (params) => {
  return get("/users/getUserList", params);
};

export const allQuestionList = (params) => {
  return get("/questions/getQuestions", params);
};

export const myExamList = (params) => {
  return get("/users/getExamsList", params);
};

export const examResult = (params) => {
  return get("/results/detail/", params);
};

export const isTest = (params) => {
  return get("/users/startAnswering/", params);
};
// POST
export const login = (params) => {
  return post("users/login/", params);
};
export const register = (params) => {
  return post("users/register/", params);
};

export const sendCode = (params) => {
  return post("users/emailCode/", params);
};

export const findPwd = (params) => {
  return post("users/findPwd/", params);
};

export const emailFindPwd = (params) => {
  return post("users/emailFindPwd/", params);
};

export const changeEmailCode = (params) => {
  return post("users/changeEmailCode/", params);
};

export const changeEmail = (params) => {
  return post("users/changeEmail/", params);
};

export const addUser = (params) => {
  return post("users/addUser/", params);
};

export const createQuestions = (params) => {
  return post("/questions/create/", params);
};

export const createPapers = (params) => {
  return post("/papers/create/", params);
};

export const createExam = (params) => {
  return post("/exams/create/", params);
};

export const resultCreat = (params) => {
  return post("/users/submitCard/", params);
};
// PUT
export const editorUser = (params) => {
  return put("users/editorUser/", params);
};

export const editorAdmin = (params) => {
  return put("users/editorAdmin/", params);
};

export const resetPassword = (params) => {
  return put("users/resetPassword/", params);
};

export const passUser = (params) => {
  return put("users/passUser/", params);
};

export const changeStatus = (params) => {
  return put("users/changeStatus/", params);
};

export const updateQuestion = (params) => {
  return put("questions/update/", params);
};

export const papersUpdate = (params) => {
  return put("papers/update/", params);
};

export const papersChange = (params) => {
  return put("papers/change/", params);
};

export const examsUpdate = (params) => {
  return put("exams/update/", params);
};

export const resetExam = (params) => {
  return put("exams/resetExam/", params);
};

// DELETE
export const logout = (params) => {
  return del("users/logout/", params);
};

export const deluser = (params) => {
  return del("users/deleteUsers/", params);
};

export const delQuestion = (params) => {
  return del("questions/delete/", params);
};

export const delPapers = (params) => {
  return del("papers/delete/", params);
};

export const delExam = (params) => {
  return del("exams/delete/", params);
};
