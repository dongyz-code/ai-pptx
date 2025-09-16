import path from 'path';
import fse from 'fs-extra';
import { registerAs } from '@nestjs/config';

import type { ROOT_CONFIG } from '@pkg/types';

const __dirname = import.meta.dirname;

export const getConfig = () => {
  /** 项目根目录 */
  const root_dir = path.join(__dirname, '../..');
  /** 项目SRC目录 */
  const src_dir = path.join(__dirname, '..');
  /** 项目静态资源目录 */
  const static_dir = path.join(root_dir, './static');
  /** 日志目录 */
  const log_dir = path.join(root_dir, './logs');
  /** 配置文件目录 */
  const config_dir = path.join(root_dir, './config');

  const rootConf = (() => {
    try {
      const conf = fse.readJSONSync(path.join(config_dir, 'conf.json'), 'utf-8');

      if (!conf) {
        throw new Error('配置文件不存在');
      }

      return conf as ROOT_CONFIG;
    } catch (e) {
      throw new Error(e);
    }
  })();

  return {
    ...rootConf,
    dirs: {
      root_dir: root_dir,
      src_dir: src_dir,
      static_dir: static_dir,
      log_dir: log_dir,
      config_dir: config_dir,
    },
  };
};

export default registerAs('appConfig', getConfig);
