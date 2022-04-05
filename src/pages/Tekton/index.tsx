import { useModel, useRequest } from 'umi';
import styles from './index.less';
import logo from '../../../public/icons/icon-192x192.png';
import ProCard from '@ant-design/pro-card';
import { getProjects } from '@/services/demci/project';

import { Image } from 'antd';
export default function Page() {
  const message = useModel('demo');
  const counter = useModel('counter');
  const { error, loading, data } = useRequest(getProjects);
  if (error) {
    return <div>{error.message}</div>;
  }
  if (loading) {
    return <div>loading</div>;
  }
  // @ts-ignore
  const projects: DEM_CI.Project[] = data;
  console.log(data);
  console.log(loading);
  return (
    <div>
      <h1 className={styles.title}>{message}</h1>
      <h1 className={styles.title}>{counter.counter}</h1>
      <button onClick={counter.increment}>inc</button>
      <button onClick={counter.decrement}>dec</button>
      <Image src="/favicon.ico" />
      <Image src={logo} />
      <ProCard
        title="标题"
        extra="extra"
        tooltip="这是提示"
        style={{ maxWidth: 300 }}
        headerBordered
      >
        内容
      </ProCard>
      {projects.map((item: DEM_CI.Project) => (
        <ProCard
          key={item.id}
          title={item.name}
          extra={item.description}
          style={{ maxWidth: 300 }}
          headerBordered
        ></ProCard>
      ))}
    </div>
  );
}
