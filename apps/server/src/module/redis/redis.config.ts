export interface RedisModuleOptions {
  host: string;
  port: number;
  username?: string;
  password?: string;
  db?: number;
  tls?: boolean;
  keyPrefix?: string;
}
