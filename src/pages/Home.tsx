

import Canvas from '@/components/Canvas';
import RandWheel, { WheelItem } from '@/components/RandWheel';
import { App } from '@/components/LotteryCarousel';
import { Button } from 'antd';
import { ButtonHTMLType } from 'antd/lib/button/button';
import React, { useState } from 'react';
import styles from './home.less';


const Home: React.FC = () => {
  const [wheelItems, setWheelItems] = useState<WheelItem[]>([
    {
      name: '红',
      weight: 11,
    },
    {
      name: '紫色',
      weight: 12,
    },
    {
      name: '紫白色',
      weight: 13,
    }, {
      name: '绿色',
      weight: 14,
    },
    {
      name: '橘色',
      weight: 15,
    }
  ]);
  const clickButton = (e: any) => {
    console.log("清除", e);
    setWheelItems([]);
  }
  return (
    <>
      <App></App>
      <div className={styles.bc}>
        <Canvas width={300} height={300} />

        <span>Home</span>

      </div>
      <RandWheel width={600} height={600} wheelItems={wheelItems}></RandWheel>
      <Button type="primary" onClick={clickButton}>清除</Button>
    </>
  );
}

// 导出组件
export default Home;
