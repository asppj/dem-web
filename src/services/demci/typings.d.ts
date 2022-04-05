declare namespace DEM_CI {
  type Project = {
    id?: string;
    name?: string;
    description?: string;
    apps?: App[];
  };

  type App = {
    id: number;
    name: string;
    description: string;
    repo: Repo[];
  };

  type Repo = {
    id: number;
    name: string;
    git_url: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };
  type ruleParams = {
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  };
}
