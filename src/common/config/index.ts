import jwtConfig from './jwt';
import uploadConfig from './upload';
import redisConfig from './redis';
import ossConfig from './oss';

const appConfig: any[] = [uploadConfig, redisConfig, jwtConfig, ossConfig];

export default appConfig;
