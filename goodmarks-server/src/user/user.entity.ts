import Bookmark from 'src/bookmark/bookmark.entity';
import Tag from 'src/bookmark/tag.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user, { cascade: true })
  bookmarks: Bookmark[];

  @OneToMany(() => Tag, (tag) => tag.user, { cascade: true })
  tags: Tag[];

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}

export default User;
