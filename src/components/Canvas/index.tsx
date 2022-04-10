import { useCallback, useEffect, useRef, useState } from "react";
import styles from './index.less';
interface CanvasProps {
  width: number;
  height: number;
}

type Coordinate = {
  x: number;
  y: number;
}
const Canvas = ({ width, height }: CanvasProps) => {
  // 引用
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 设置属性
  const [isPainting, setIsPainting] = useState(false);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);

  // 解析鼠标位置方法
  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return undefined;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    return { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop };
  }
  // 鼠标位置更新
  const startPaint = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setIsPainting(true);
      setMousePosition(coordinates);
    }
  }, []);

  // 鼠标点击事件
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener("mousedown", startPaint);
    return () => {
      canvas.removeEventListener("mousedown", startPaint);
    }
  }, [startPaint]);
  // 划线方法
  const drawLine = (from: Coordinate, to: Coordinate) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context) {
      context.strokeStyle = "#BADA55";
      context.lineJoin = "round";
      context.lineWidth = 10;

      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.closePath();

      context.stroke();
    }
  }
  // 鼠标移动事件
  const paint = useCallback(
    (event: MouseEvent) => {
      if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
        }
      }
    }, [isPainting, mousePosition]
  );
  // 鼠标移动事件
  useEffect(() => {
    if (!canvasRef.current || !mousePosition) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener("mousemove", paint);
    return () => {
      canvas.removeEventListener("mousemove", paint)
    }
  });


  // 停止回执
  const exitPaint = useCallback(() => {
    setIsPainting(false);
  }, []);
  // 鼠标抬起事件或移出画布
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint)
    return () => {
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint)
    }
  }, [exitPaint]);


  return (
    <>
      <canvas ref={canvasRef} className={styles.dc} height={height} width={width} />
    </>
  )
}

Canvas.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight
}

export default Canvas;
