import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { University } from './university.schema';
import { Model } from 'mongoose';

@Injectable()
export class UniversityService {
  constructor(@InjectModel('Universities') private uniModel: Model<University>) { }

  async findAll(): Promise<University[]> {
    return this.uniModel.find().exec();
  }

  async findOne(id: string): Promise<University> {
    return this.uniModel.findById(id).exec();
  }
}
