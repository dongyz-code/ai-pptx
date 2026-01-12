import { exists } from 'fs-extra';
import { existsSync } from 'fs';
import { extname, resolve } from 'path';
import { getKeys } from './object.js';

const EXT = {
  javascript: ['.js', '.jsx'],
  typescript: ['.ts', '.tsx'],
};

export async function resolveScriptPath(scriptPath: string) {
  const absPath = resolve(scriptPath);
  const ext = extname(absPath);
  const base = ext ? absPath.slice(0, -ext.length) : absPath;

  const types = getKeys(EXT)
    .map((k) => {
      const exts = EXT[k];
      return exts.map((e) => {
        return {
          type: k,
          ext: e,
        };
      });
    })
    .flat();

  for (const type of types) {
    const path = `${base}${type.ext}`;
    if (await exists(path)) {
      return {
        type: type.type,
        path,
      };
    }
  }

  throw new Error(`Worker script not found: ${scriptPath}`);
}

export function resolveScriptPathSync(scriptPath: string) {
  const absPath = resolve(scriptPath);
  const ext = extname(absPath);
  const base = ext ? absPath.slice(0, -ext.length) : absPath;

  const types = getKeys(EXT)
    .map((k) => {
      const exts = EXT[k];
      return exts.map((e) => {
        return {
          type: k,
          ext: e,
        };
      });
    })
    .flat();

  for (const type of types) {
    const path = `${base}${type.ext}`;
    if (existsSync(path)) {
      return {
        type: type.type,
        path,
      };
    }
  }

  throw new Error(`Worker script not found: ${scriptPath}`);
}
