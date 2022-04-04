import { useModel } from 'umi';
import styles from './index.less';
import logo from '../../../public/icons/icon-192x192.png';

import { Image } from 'antd';
export default function Page() {
  const message = useModel('demo');
  const counter = useModel('counter');
  return (
    <div>
      <h1 className={styles.title}>{message}</h1>
      <h1 className={styles.title}>{counter.counter}</h1>
      <button onClick={counter.increment} >inc</button>
      <button onClick={counter.decrement}>dec</button>
      <Image src="/favicon.ico" />
      <Image src={logo} />
    </div>
  );
}
