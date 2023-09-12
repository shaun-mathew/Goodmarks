import { Exclude } from 'class-transformer';
import User from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Tag from './tag.entity';

@Entity()
class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  userDescription: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.bookmarks)
  user: User;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @Column()
  date: Date;

  constructor(bookmark: Partial<Bookmark>) {
    Object.assign(this, bookmark);
  }
}

export default Bookmark;
