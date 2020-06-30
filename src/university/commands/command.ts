import { IsNotEmpty, IsString, Equals, IsNumber } from 'class-validator';

export class Command {
  @IsNotEmpty()
  @IsString()

  @IsNotEmpty()
  @IsString()
  @Equals('command')
  readonly type: string;

  @IsNotEmpty()
  @IsString()
  readonly action: string;

  @IsNotEmpty()
  @IsNumber()
  readonly timestamp: number;
}
