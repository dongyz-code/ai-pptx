import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class System {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string;
}
