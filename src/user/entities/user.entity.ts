import { Item } from 'src/item/entities/item.entity';
import { UserRole } from 'src/types/Auth';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, default: null })
  hashedRefreshToken: string;

  @Column({ select: false, type: 'json' })
  roles: UserRole[];

  @OneToMany(() => Item, (item) => item.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  items: Item[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
