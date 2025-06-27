import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.items, { onDelete: 'CASCADE' })
  user: Relation<User>;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Tag, (tag) => tag.items)
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
