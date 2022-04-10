

const strToColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}
export default strToColor;

// color:#336699
// colorReverse:#996633
export const colorReverse = (color: string) => {
  const col = color.replace('#', '');
  let c16, c10;
  const max16 = 15, b = [];
  for (let i = 0; i < col.length; i++) {
    c16 = parseInt(col.charAt(i), 16);//  to 16进制
    c10 = parseInt(`${max16 - c16}`, 10);// 10进制计算
    b.push(c10.toString(16)); // to 16进制
  }
  return '#' + b.join('');
}

