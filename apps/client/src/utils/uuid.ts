import { v7 as uuidV7 } from 'uuid';

// 写一个雪花id
let snowflakeId = 0;
export function snowflake() {
  snowflakeId = snowflakeId + 1;
  const time = new Date().getTime();
  const random = Math.floor(Math.random() * 10);
  const id = `${time}${random}${snowflakeId}`;
  return id;
}

export function uuid() {
  const id = uuidV7();
  return id.replace(/-/g, '');
}
