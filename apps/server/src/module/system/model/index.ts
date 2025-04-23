import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'system',
})
export class System {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string;
}
