import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from 'src/user/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.tags)
  user: User;

  constructor(tag: Partial<Tag>) {
    Object.assign(this, tag);
  }
}

export default Tag;
