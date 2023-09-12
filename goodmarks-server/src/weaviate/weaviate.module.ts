import { Module, DynamicModule, Inject } from '@nestjs/common';
import weaviate, { ConnectionParams } from 'weaviate-ts-client';
import { WEAVIATE_CONFIG, WEAVIATE_CONNECTION, CLASS_OBJ } from './constants';
import { WeaviateModuleOptions, WeaviateConfigOptions } from './interface';
import { WeaviateService } from './weaviate.service';

@Module({})
export class WeaviateModule {
  public static register(config: WeaviateConfigOptions): DynamicModule {
    return {
      module: WeaviateModule,
      imports: [],
      providers: [
        {
          provide: WEAVIATE_CONNECTION,
          useValue: createWeaviateProvider(config),
        },
        {
          provide: CLASS_OBJ,
          useValue: config.classObj,
        },
        WeaviateService,
      ],
      exports: [WEAVIATE_CONNECTION, CLASS_OBJ, WeaviateService],
    };
  }

  static registerAsync(options: WeaviateModuleOptions): DynamicModule {
    return {
      module: WeaviateModule,
      imports: [...options.imports],
      providers: [
        {
          provide: WEAVIATE_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: WEAVIATE_CONNECTION,
          useFactory: createWeaviateProvider,
          inject: [WEAVIATE_CONFIG],
        },
        {
          provide: CLASS_OBJ,
          useFactory: ({ classObj }: WeaviateConfigOptions) => classObj,
          inject: [WEAVIATE_CONFIG],
        },
        WeaviateService,
      ],
      exports: [WEAVIATE_CONNECTION, CLASS_OBJ, WeaviateService],
    };
  }
}

function createWeaviateProvider(config: WeaviateConfigOptions) {
  const { classObj: _, ...clientOptions } = config;
  return weaviate.client(clientOptions);
}
