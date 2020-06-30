import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { UniversityService } from './university.service';

describe('UniversityService', () => {
  function mockUniversityModel(dto: any) {
    this.data = dto;
    this.save  = () => {
      return this.data;
    };
  }

  let service: UniversityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversityService,
        {
          provide: getModelToken('Universities'),
          useValue: mockUniversityModel,
        }
      ],
    }).compile();

    service = module.get<UniversityService>(UniversityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
