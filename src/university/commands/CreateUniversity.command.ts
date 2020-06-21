import { Command } from "./command";

export interface CreateUniversityCommand extends Command {
  readonly address: string;
}
