import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Message {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  senderId: string;

  @Column()
  roomId: string;

  @Column()
  content: string;

  @Column()
  timestamp: Date;
}
