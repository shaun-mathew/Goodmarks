import { ConnectionParams } from 'weaviate-ts-client';

export interface WeaviateConfigOptions extends ConnectionParams {
  classObj: any;
}
export interface WeaviateModuleOptions {
  imports: any;
  inject: any;
  useFactory: (...args: any[]) => WeaviateConfigOptions;
  extraProviders?: any;
}
