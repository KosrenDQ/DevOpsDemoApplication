import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { Event } from '../university/events/event';
import { StudentEnrolledEvent } from '../university/events/studentEnrolled.event';


export const Evt = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<Event> => {
    const ctxData = ctx.switchToRpc().getData();
    const value = ctxData.value;
    if (!ctxData || !ctxData.value || !ctxData.topic || !value.type || !value.action || value.type !== 'event') {
      throw new RpcException('Invalid kafka event message');
    }

    let event: Event;
    switch (value.action) {
      case 'StudenEnrolled':
        event = plainToClass(StudentEnrolledEvent, value);
        break;

      default:
        throw new RpcException(`Unknown event action: ${value.action}`);
    }

    // Validate
    const errors = await validate(event);
    if (errors.length > 0) {
      throw new RpcException(errors);
    }

    return event;
  }
);
