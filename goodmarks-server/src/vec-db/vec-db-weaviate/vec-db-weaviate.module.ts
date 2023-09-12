import { Module, DynamicModule } from '@nestjs/common';
import { VecDbWeaviateService } from './vec-db-weaviate.service';
import {
  WeaviateModule,
  WeaviateConfigOptions,
  WeaviateModuleOptions,
} from '../../weaviate';

@Module({})
export class VecDbWeaviateModule {
  public static register(config: WeaviateConfigOptions): DynamicModule {
    return {
      module: VecDbWeaviateModule,
      imports: [WeaviateModule.register(config)],
      providers: [VecDbWeaviateService],
      exports: [VecDbWeaviateService, WeaviateModule],
    };
  }

  public static registerAsync(options: WeaviateModuleOptions): DynamicModule {
    return {
      module: VecDbWeaviateModule,
      imports: [WeaviateModule.registerAsync(options)],
      providers: [VecDbWeaviateService],
      exports: [VecDbWeaviateService, WeaviateModule],
    };
  }
}
