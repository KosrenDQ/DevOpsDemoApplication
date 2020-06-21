import { createParamDecorator, ExecutionContext, BadRequestException } from "@nestjs/common";

export const Command = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const ctxData = ctx.switchToRpc().getData();
    const value = ctxData.value;
    if (!ctxData || !ctxData.value || !ctxData.topic || !value.type) {
      throw new BadRequestException('Invalid kafka message');
    }

    switch(value.type) {
      case 'CreateUniversity':
        return value;

    default:
        throw new BadRequestException('Unknown command type');
    }
  }
);
