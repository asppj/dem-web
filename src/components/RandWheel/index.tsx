import style from "./index.less";
import { MouseEvent, useEffect, useRef, useState } from 'react'
import strToColor, { colorReverse } from '@/util/color'
import { Button } from "antd";
import { conversionSubmitValue } from "@ant-design/pro-utils";
import { add } from "@umijs/deps/compiled/lodash";
export interface WheelItem {
  name: string;
  weight: number;
  color?: string; // 指定颜色
  rate?: number; // 概率；指定概率就不算权重
}

interface wheeItemType {
  name: string;
  color: string;
  fontColor: string;
  rate: number;
  weight: number;
}

export interface RandWheelProps {
  width: number; // 宽度
  height: number; // 高度
  wheelItems: WheelItem[]; // 数据
}

/*
方法
*/

// 绘制箭头函数

interface Position {
  x: number,
  y: number,
}

class Wheel {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public radius: number;
  public color: string;
  public running: boolean;
  public ctx: CanvasRenderingContext2D;
  public canvas: { width: number, height: number };
  constructor(ctx: CanvasRenderingContext2D, canvas: { width: number, height: number }, x: number, y: number, vx: number, vy: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
    this.running = false;
    this.ctx = ctx;
    this.canvas = canvas;

  }
  clear() {
    if (!this.ctx) {
      return;
    }
    this.ctx.fillStyle = 'rgb(255,255,255,0.3)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
  draw() {
    if (!this || !this.ctx) {
      return;
    }
    this.ctx.save()
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.restore();
  }

  run() {
    if (!this.ctx) {
      return;
    }
    this.clear()
    this.draw();
    this.vx *= 1.001;
    this.vy *= 1.00025;
    this.x += this.vx * (1 - 0.2) * 2;
    this.y += this.vy * (1 - 0.8) * 3;
    if (this.x < this.radius || this.x > this.canvas.width - this.radius) {
      this.vx = -this.vx;
    }
    if (this.y < this.radius || this.y > this.canvas.height - this.radius) {
      this.vy = -this.vy;
    }

    window.requestAnimationFrame(() => { this.run() });
  }
}

const drawArrow = (ctx: CanvasRenderingContext2D, start: Position, end: Position, color: string) => {
  ctx.save();
  // ctx.translate(150, 150);
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const arrowLength = 10;
  const arrowAngle = Math.PI / 6;
  const arrowPoint1 = {
    x: end.x - arrowLength * Math.cos(angle + arrowAngle),
    y: end.y - arrowLength * Math.sin(angle + arrowAngle),
  }
  const arrowPoint2 = {
    x: end.x - arrowLength * Math.cos(angle - arrowAngle),
    y: end.y - arrowLength * Math.sin(angle - arrowAngle),
  }
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.lineTo(arrowPoint1.x, arrowPoint1.y);
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(arrowPoint2.x, arrowPoint2.y);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
  const time = new Date();
  ctx.resetTransform();
  ctx.translate(start.x, start.y);
  ctx.rotate((1 * Math.PI / 60) * time.getSeconds() + (1 * Math.PI / 60000) * time.getMilliseconds());
  // ctx.fillRect(0, 102, 50, 24);
  // ctx.restore();
}


const RandWheel = ({ width, height, wheelItems }: RandWheelProps) => {
  const wheelItemsData: wheeItemType[] = [];
  // wheelItems 数据
  let allWeight = 0;
  wheelItems.forEach(item => {
    allWeight += item.weight;
  });

  wheelItems.forEach(item => {
    item.rate = item.rate || item.weight / allWeight;
    item.color = item.color || strToColor(item.name);
    wheelItemsData.push({
      name: item.name,
      color: item.color,
      fontColor: colorReverse(item.color),
      rate: item.rate,
      weight: item.weight
    });
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 属性
  // const [sa, setSa] = useState(-Math.PI / 2);
  // draw
  const draw = (ctx: CanvasRenderingContext2D, radius: number, start: number, items: wheeItemType[], all: number) => {

    let startAngle = start;
    let endAngle = - Math.PI / 2;
    const ox = radius * 1.1;
    const oy = radius * 1.2;
    items.map((item, index) => {
      const angle = item.rate * 2 * Math.PI;
      endAngle += angle;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.arc(ox, oy, radius, startAngle, endAngle, false);
      ctx.closePath();
      // ctx.fillText(item.name, ox, oy)
      ctx.fillStyle = item.color ? item.color : strToColor(item.name);
      ctx.fill();
      // ctx.fillStyle = item.fontColor;
      ctx.fillText(`${item.name}-${(item.weight * 100 / all).toFixed(2)}%`, radius + 250, oy + index * 30);
      ctx.font = "20px Arial";
      startAngle = endAngle;
      ctx.save();

    })
    // 小圆
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.fillStyle = '#a21fd2';
    ctx.arc(ox, oy, radius * 0.2, startAngle, startAngle + 2 * Math.PI, false);
    // ctx.fill();
    ctx.stroke();// 描边
    ctx.fill();// 填充
    ctx.closePath();
    ctx.save();
    // 指针
    drawArrow(ctx, { x: ox, y: oy }, { x: ox, y: oy - 0.3 * radius }, "221f22");
    // ctx.beginPath();
    // ctx.moveTo(ox, oy)
    // ctx.lineTo(ox, oy - 0.3 * radius);
    // ctx.strokeStyle = '#221f22';
    // ctx.lineWidth = 2;
    // ctx.stroke();
    // ctx.closePath();
    // 图例
    const legendLength = 10;
    const posX = radius * 2.5;
    items.map((item, index) => {
      const number = 3 * legendLength * (index + 2);
      ctx.fillStyle = item.color ? item.color : strToColor(item.name);
      ctx.fillRect(posX, number, legendLength, legendLength)
      ctx.font = "20px Arial";
      const words = `${item.name}(${item.weight})`;
      ctx.fillStyle = '#bac4c5';
      ctx.fillText(words, posX + legendLength + 5, number + legendLength + 1);
    })

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.save();
        ctx.fillStyle = 'rgb(' + (51 * i) + ', ' + (255 - 51 * i) + ', 255)';
        ctx.translate(10 + j * 50, 10 + i * 50);
        ctx.fillRect(0, 0, 25, 25);
        ctx.restore();
      }
    }

    // draw(ctx, radius, wheelItemsData, allWeight);
    window.requestAnimationFrame(() => {
      ctx.clearRect(0, 0, radius * 4, radius * 4); // clear canvas
      draw(ctx, radius, 0, items, all);
    })
    // //折线和文字
    // let lineStartAngle = 0;
    // // broken line length
    // const brokenLine = 10;
    // const textLength = brokenLine * 4;
    // items.map((item) => {
    //   const angle = item.rate ? item.rate * 2 * Math.PI : item.weight / all * 2 * Math.PI;
    //   endAngle = endAngle + angle;
    //   const newAngle = angle / 2;
    //   const brokenAngle = lineStartAngle + newAngle;
    //   lineStartAngle += angle;
    //   // line
    //   const distancex = Math.cos(brokenAngle);
    //   const distancey = Math.sin(brokenAngle);
    //   const startx = radius * distancex;
    //   const starty = radius * distancey;
    //   const endx = (radius + brokenLine) * distancex;
    //   const endy = (radius + brokenLine) * distancey;
    //   const beginx = ox + startx;
    //   const beginy = oy + starty;
    //   const overx = ox + endx;
    //   const overy = oy + endy;
    //   ctx.beginPath();
    //   ctx.moveTo(beginx, beginy);
    //   ctx.lineTo(overx, overy);
    //   const percent = `${Math.round(100 * (item.rate ? item.rate : item.weight / all))}%`;
    //   let overlinex = overx + textLength;
    //   let percentX = overx + 15;
    //   if (overx > ox) {
    //     overlinex = overx - textLength;
    //     percentX = overlinex;
    //   }
    //   ctx.lineTo(overlinex, overy);
    //   ctx.strokeStyle = item.color ? item.color : strToColor(item.name);
    //   ctx.stroke();
    //   ctx.font = "20px Arial";
    //   ctx.fillStyle = "#232";
    //   ctx.fillText(`${item.name}-${percent}`, percentX, overy - 22);
    // })
  }
  const [raf, setRaf] = useState(-1);
  // 渲染
  useEffect(() => {
    if (!canvasRef.current || !wheelItemsData) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    const radius = canvas.height / 3; // 半径
    const angle = Math.PI / 4;
    ctx.clearRect(0, 0, canvas.height, canvas.height); // clear canvas
    ctx.globalAlpha = 0.9;
    draw(ctx, radius, angle, wheelItemsData, allWeight);
    // // init(ctx)
    // const wheel = new Wheel(ctx, { width: canvas.width, height: canvas.height }, radius, radius, 1, 1.5, radius / 20, "red");
    // wheel.run();
    // const img = canvas.toDataURL("image/png");
    // console.log("图像", img)
    // canvas.toBlob((blob) => {
    //   console.log("blob", blob)
    // });
    // ctx.beginPath();
    // ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
    // ctx.stroke();
    // const pt = new Path2D();
    // pt.addPath(pt);
    // ctx.drawFocusIfNeeded()
    // ctx.addHitRegion({ id: "hit-region" });
    // const moveHandler = (e: MouseEvent) => {
    //   console.log(e)
    //   if (e.region) {
    //     alert("hisRegion", e.region)
    //   }
    // }
    // canvas.addEventListener("mousemove", moveHandler)
    // const moveHandler = () => {
    // if (!wheel.running) {
    //   wheel.clear();
    //   wheel.x = e.offsetX;
    //   wheel.y = e.offsetY;
    //   wheel.draw();
    // }
    // }
    // const clickHandler = () => {
    //   const _raf = window.requestAnimationFrame(wheel.draw);
    //   setRaf(_raf);

    // }
    // const mouseOutHandler = () => {
    //   window.cancelAnimationFrame(raf)

    // }
    // canvas.addEventListener('mousemove', moveHandler);
    // canvas.addEventListener("click", clickHandler)
    // canvas.addEventListener('mouseout', mouseOutHandler);
    // return () => { // 卸载事件
    //   canvas.removeEventListener('click', wheel.draw)
    //   canvas.removeEventListener('mousemove', moveHandler)
    //   canvas.removeEventListener('mouseout', mouseOutHandler)
    // }


    // const [click, out] = wheel.mouseClick();
    // canvas.addEventListener('click', click)
    // return () => { canvas.removeEventListener('mouseout', out) }

  }, [wheelItemsData, allWeight])


  return (<>
    <canvas className={style.body} ref={canvasRef} height={height} width={width}>

    </canvas>
    <canvas id="button" tabindex="0" role="button" aria-pressed="false" aria-label="Start game"></canvas>

    <Button onClick={() => {
      // const inc = Math.random() * 10;
      // console.log(inc)
      // setSa((sa + inc) % Math.PI)
    }}>转动画布</Button>
  </>)
}
export default RandWheel;


// const sun = new Image();
// const moon = new Image();
// const earth = new Image();

// function init(ctx: CanvasRenderingContext2D) {
//   sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
//   moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
//   earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
//   window.requestAnimationFrame(() => { draw(ctx) });
// }

// function draw(ctx: CanvasRenderingContext2D) {
//   if (!ctx) {
//     return;
//   }
//   ctx.globalCompositeOperation = 'destination-over';
//   ctx.clearRect(0, 0, 300, 300); // clear canvas

//   ctx.fillStyle = 'rgba(0,0,0,0.4)';
//   ctx.strokeStyle = 'rgba(0,153,255,0.9)';
//   ctx.save();
//   ctx.translate(150, 150);

//   // Earth
//   const time = new Date();
//   ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
//   ctx.translate(105, 0);
//   ctx.fillRect(0, -12, 50, 24); // Shadow
//   ctx.drawImage(earth, -12, -12);

//   // Moon
//   ctx.save();
//   ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
//   ctx.translate(0, 28.5);
//   ctx.drawImage(moon, -3.5, -3.5);
//   ctx.restore();

//   ctx.restore();

//   ctx.beginPath();
//   ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
//   ctx.stroke();

//   ctx.drawImage(sun, 0, 0, 300, 300);

//   window.requestAnimationFrame(() => { draw(ctx) });
// }

// /*
// wheel
// */

