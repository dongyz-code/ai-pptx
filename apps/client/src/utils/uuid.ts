// 写一个雪花id
let snowflakeId = 0;
export function snowflake() {
  snowflakeId = snowflakeId + 1;
  const time = new Date().getTime();
  const random = Math.floor(Math.random() * 10);
  const id = `${time}${random}${snowflakeId}`;
  return id;
}
