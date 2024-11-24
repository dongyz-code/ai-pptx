import path from 'path';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** 项目根目录 */
export const ROOT_DIR = path.join(__dirname, '../..');

/** 项目SRC目录 */
export const SERVER_SRC_DIR = path.join(__dirname, '..');

/** 项目静态资源目录 */
export const SERVER_STATIC_DIR = path.join(ROOT_DIR, './static');

/** 日志目录 */
export const LOG_DIR = path.join(SERVER_STATIC_DIR, 'logs');

/** 项目配置文件目录 */
export const CONFIG_DIR = path.join(ROOT_DIR, '.conf');

/** 初始化目录 */
fse.ensureDir(LOG_DIR);
