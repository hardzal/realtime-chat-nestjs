import { StringUtil } from './string.util';
import * as bcrypt from 'bcrypt';

export class PasswordHelper {
  static async hash(
    password: string,
  ): Promise<{ hash: string; passKey: string }> {
    const passKey = StringUtil.generateRandomString(10);
    const hash = await bcrypt.hash(password + passKey, 10);

    return {
      passKey,
      hash,
    };
  }

  static comparePassword(password: string, passKey: string, hash: string) {
    return bcrypt.compare(password + passKey, hash);
  }
}
