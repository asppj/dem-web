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

  // 转盘数据
  type WheelData = {
    id: number;
    name: string;
    weight: number;
  };
}
