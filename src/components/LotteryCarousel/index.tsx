import strToColor, { colorReverse } from '@/util/color';
import styles from './index.less';

import React from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Star, Text, Rect, Circle, Arc, Ellipse } from 'react-konva';
import Konva from 'konva';
import { IFrame } from 'konva/lib/types';



/*
  单个奖品
*/
export class WheelItem {
  public name: string;
  public weight: number;
  constructor(name: string, weight: number) {
    this.name = name;
    this.weight = weight;
  }

  color() {
    return strToColor(`${this.name}${this.weight}`);
  }
}
/*
入参
*/
export class WheeItemList {
  public wheelItems: WheelItem[];
  public allWeight: number;
  constructor(wheelItems: WheelItem[]) {
    this.wheelItems = wheelItems;
    let sum = 0;
    this.wheelItems.forEach(item => {
      item.weight = item.weight > 0 ? item.weight : 0;
      sum += item.weight
    })
    this.allWeight = sum;
  }
}

export interface LotteryParams {
  width: number;
  height: number;
  wheelItems: [];
}


export const LotteryCarousel = () => {
  return (<>
    <div className={styles.container}></div>
  </>)
}


function generateShapes() {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
}

const INITIAL_STATE = generateShapes();
class ColoredRect extends React.Component {
  state = {
    color: 'green'
  };
  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  };
  render() {
    return (
      <Rect
        x={20}
        y={20}
        width={50}
        height={50}
        fill={this.state.color}
        shadowBlur={5}
        onClick={this.handleClick}
      />
    );
  }
}
const Shape = () => {
  const [color, setColor] = React.useState('#2334F3');


  const stage = new Konva.Stage({
    container: 'container',
    width: 500,
    height: 500,
  });

  const layer = new Konva.Layer();

  /*
   * leave center point positioned
   * at the default which is the top left
   * corner of the rectangle
   */

  const blueRect = new Konva.Rect({
    x: 50,
    y: 75,
    width: 100,
    height: 50,
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4,
  });

  /*
   * move center point to the center
   * of the rectangle with offset
   */
  const yellowRect = new Konva.Rect({
    x: 220,
    y: 75,
    width: 100,
    height: 50,
    fill: 'yellow',
    stroke: 'black',
    strokeWidth: 4,
    offset: {
      x: 50,
      y: 25,
    },
  });

  /*
   * move center point outside of the rectangle
   * with offset
   */

  const redRect = new Konva.Rect({
    x: 400,
    y: 75,
    width: 100,
    height: 50,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
    offset: {
      x: -100,
      y: 0,
    },
  });

  layer.add(blueRect);
  layer.add(yellowRect);
  layer.add(redRect);
  stage.add(layer);

  // one revolution per 4 seconds
  const angularSpeed = 90;
  const anim = new Konva.Animation(function (frame) {
    var angleDiff = (frame.timeDiff * angularSpeed) / 1000;
    blueRect.rotate(angleDiff);
    yellowRect.rotate(angleDiff);
    redRect.rotate(angleDiff);
  }, layer);

  anim.start();
  // then use it
  return (
    <Stage id="container">
      <Ellipse
        x={100}
        y={100}
        draggable
        // radius={50}
        radiusX={50}
        radiusY={60}
        fill={color}
        onClick={() => {
          setColor(colorReverse(color));
        }}
        offsetX={10}
        offsetY={10}
        fillPatternRotation={45}
        angle={70}
        rotationDeg={45}
        rotation={45} innerRadius={0} outerRadius={0} />
    </Stage>
  );
};
export const App = () => {



  return (
    <>
      <Stage width={window.innerWidth / 3} height={window.innerHeight / 3}>
        <Layer>
          <Shape></Shape>

        </Layer>
      </Stage>
    </>

  );
};

