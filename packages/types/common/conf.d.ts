export type ROOT_CONFIG = {
  app: {
    port: 3000;
    environment: 'development' | 'test' | 'uat' | 'prod';
    jwtSecret: string;
    jwtExpiresIn: string | number;
  };
  pg: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    schema: string;
  };
  redis: {
    host: string;
    port: 6379;
    username: string;
    password: string;
  };
};
