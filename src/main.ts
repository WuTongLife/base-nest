import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@filters/http-exception.filter';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TransformInterceptor } from '@interceptors/response.interceptor';
import { LoggingInterceptor } from '@interceptors/logging.interceptor';
import { ErrorInterceptor } from '@interceptors/error.interceptor';

declare const module: any;
const port = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const nestWinston = app.get(WINSTON_MODULE_NEST_PROVIDER);
  // 设置所有 api 访问前缀
  app.setGlobalPrefix('/api');
  // web 漏洞,
  app.use(helmet());
  // 访问频率限制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 限制15分钟内最多只能访问1000次
    }),
  );

  //全局的logger
  app.useLogger(nestWinston);
  // 全局注册通用验证管道ValidationPipe
  app.useGlobalPipes(new ValidationPipe());
  // 捕获全局错误
  app.useGlobalFilters(new HttpExceptionFilter(nestWinston.logger));
  // 添加拦截器
  app.useGlobalInterceptors(
    new TransformInterceptor(new Reflector()),
    new ErrorInterceptor(new Reflector(), nestWinston.logger),
    new LoggingInterceptor(nestWinston.logger),
  );

  // 接口文档 swagger 参数
  const options = new DocumentBuilder()
    .setTitle('工作流 app')
    .setDescription('API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // 设置 swagger 网址
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  // 热更新
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
