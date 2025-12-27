import { v7 as uuidV7 } from 'uuid';

function uuid32() {
  const id = uuidV7();
  return id.replace(/-/g, '');
}

export { uuidV7, uuid32 };
