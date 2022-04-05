// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取当前的用户 GET /api/demci/projects */
export async function getProjects(options?: { [key: string]: any }) {
  return request<DEM_CI.Project>('/api/demci/projects', {
    method: 'GET',
    ...(options || {}),
  });
}
