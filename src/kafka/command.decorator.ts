import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { CreateUniversityCommand } from '../university/commands/CreateUniversity.command';
import { Command } from '../university/commands/command';

export const Cmd = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<Command> => {
    const ctxData = ctx.switchToRpc().getData();
    const value = ctxData.value;
    if (!ctxData || !ctxData.value || !ctxData.topic || !value.type) {
      throw new RpcException('Invalid kafka message');
    }

    let command: Command;
    switch(value.type) {
      case 'CreateUniversity':
        command = plainToClass(CreateUniversityCommand, value);
        break;

    default:
        throw new RpcException(`Unknown command action: ${value.action}`);
    }

    // Validate
    const errors = await validate(command);
    if (errors.length > 0) {
      throw new RpcException(errors);
    }

    return command;
  }
);
