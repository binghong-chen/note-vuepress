# 异常过滤器

内置的**异常层**负责处理整个应用程序中的所有抛出的异常。当捕获到未处理的异常时，最终用户将收到友好的响应。

![img](./assets/Filter_1.png)

开箱即用，此操作由内置的全局异常过滤器执行，该过滤器处理类型 `HttpException`（及其子类）的异常。每个发生的异常都由全局异常过滤器处理, 当这个异常**无法被识别**时 (既不是 `HttpException` 也不是继承的类 `HttpException` ) , 用户将收到以下 `JSON` 响应:

```json
{
    "statusCode": 500,
    "message": "Internal server error"
}
```

## 基础异常类

`Nest`提供了一个内置的 `HttpException` 类，它从 `@nestjs/common` 包中导入。对于典型的基于`HTTP` `REST/GraphQL` `API`的应用程序，最佳实践是在发生某些错误情况时发送标准HTTP响应对象。

在 `CatsController`，我们有一个 `findAll()` 方法（`GET` 路由）。假设此路由处理程序由于某种原因引发异常。 为了说明这一点，我们将对其进行如下硬编码：

> cats.controller.ts

```typescript
@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}Copy to clipboardErrorCopied
```

我们在这里使用了 `HttpStatus` 。它是从 `@nestjs/common` 包导入的辅助枚举器。

现在当客户端调用这个端点时，响应如下所示：

```json
{
    "statusCode": 403,
    "message": "Forbidden"
}Copy to clipboardErrorCopied
```

`HttpException` 构造函数有两个必要的参数来决定响应:

- `response` 参数定义 `JSON` 响应体。它可以是 `string` 或 `object`，如下所述。
- `status`参数定义`HTTP`[状态代码](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)。

默认情况下，`JSON` 响应主体包含两个属性：

- `statusCode`：默认为 `status` 参数中提供的 `HTTP` 状态代码
- `message`:基于状态的 `HTTP` 错误的简短描述

仅覆盖 `JSON` 响应主体的消息部分，请在 `response`参数中提供一个 `string`。

要覆盖整个 `JSON` 响应主体，请在`response` 参数中传递一个`object`。 `Nest`将序列化对象，并将其作为`JSON` 响应返回。

第二个构造函数参数-`status`-是有效的 `HTTP` 状态代码。 最佳实践是使用从`@nestjs/common`导入的 `HttpStatus`枚举。

这是一个覆盖整个响应正文的示例：

> cats.controller.ts

```typescript
@Get()
async findAll() {
  throw new HttpException({
    status: HttpStatus.FORBIDDEN,
    error: 'This is a custom message',
  }, HttpStatus.FORBIDDEN);
}Copy to clipboardErrorCopied
```

使用上面的代码，响应如下所示：

```json
{
  "status": 403,
  "error": "This is a custom message"
}
```