import { Injectable, Inject } from '@nestjs/common';
import { WeaviateClient } from 'weaviate-ts-client';
import { WEAVIATE_CONNECTION, CLASS_OBJ } from './constants';

@Injectable()
export class WeaviateService {
  constructor(
    @Inject(WEAVIATE_CONNECTION) public client: WeaviateClient,
    @Inject(CLASS_OBJ) public classObj: any,
  ) {
    console.log('Adding schema');
    this.addSchema();
  }

  private async addSchema() {
    const className = this.classObj['class'];
    const schema = await this.client.schema.getter().do();

    console.log(`Class Name: ${className}`);
    console.log(`Schema: ${schema}`);

    const classExists = schema.classes.some((cls) => cls.class === className);
    console.log(`Class Exists ${classExists}`);

    if (!classExists) {
      console.log('Creating class');
      await this.client.schema.classCreator().withClass(this.classObj).do();
    }
  }
}
