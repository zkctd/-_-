import http from "../utils/request";
const IMPORT_URL = "users/addUsers/";
const IMPORT_URL2 = "questions/import/";
interface ImportResponse {
  code: number;
  data: any;
  msg: string;
}

class ImportAPI {
  /**
   * 导入用户
   *
   * @param file 文件对象
   * @returns 导入结果
   */
  static async importUsers(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return http<ImportResponse>({
      url: IMPORT_URL,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async importQuestions(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return http<ImportResponse>({
      url: IMPORT_URL2,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default ImportAPI;
