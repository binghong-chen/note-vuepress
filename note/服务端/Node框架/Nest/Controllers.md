# 控制器

| `@Request()，@Req()`      | `req`                             |
| ------------------------- | --------------------------------- |
| `@Response()，@Res()*`    | `res`                             |
| `@Next()`                 | `next`                            |
| `@Session()`              | `req.session`                     |
| `@Param(key?: string)`    | `req.params`/`req.params[key]`    |
| `@Body(key?: string)`     | `req.body`/`req.body[key]`        |
| `@Query(key?: string)`    | `req.query`/`req.query[key]`      |
| `@Headers(name?: string)` | `req.headers`/`req.headers[name]` |
| `@Ip()`                   | `req.ip`                          |
| `@HostParam()`            | `req.hosts`                       |

@Query 是 url中?后面的部分

@Param是？post提交的内容？ 不是的，是路由参数 cats/:id

@Body是消息体（post等才有）post的body

@Headers是头部（都有）



路由参数

@Get(':id')

@Param('id') id: string



@HttpCode

@Header

@Redirect



passthrough

而且，在上面的示例中，你失去与依赖于 Nest 标准响应处理的 Nest 功能（例如，拦截器（Interceptors） 和 `@HttpCode()`/`@Header()` 装饰器）的兼容性。要解决此问题，可以将 `passthrough` 选项设置为 `true`，如下所示：

```ts
import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  findAll(@Res() res: Response) {
    res.status(HttpStatus.OK).json([]);
  }
}


// 推荐这种写法，可以用到Nest的标准响应
@Get()
findAll(@Res({ passthrough: true }) res: Response) {
  res.status(HttpStatus.OK);
  return [];
}
```

