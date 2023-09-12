import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VecDbService } from './vec-db.service';
import { CLIENT } from './constants';
import { VecDbWeaviateModule } from './vec-db-weaviate/vec-db-weaviate.module';
import { VecDbWeaviateService } from './vec-db-weaviate/vec-db-weaviate.service';
import schema from './schema';

@Module({
  imports: [
    VecDbWeaviateModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: `${configService.get<string>(
          'WEAVIATE_URI',
        )}:${configService.get<string>('WEAVIATE_PORT')}`,
        scheme: 'http',
        classObj: schema,
      }),
    }),
  ],
  providers: [
    {
      provide: CLIENT,
      useClass: VecDbWeaviateService,
    },
    VecDbService,
  ],
  exports: [VecDbService],
})
export class VecDbModule {}
