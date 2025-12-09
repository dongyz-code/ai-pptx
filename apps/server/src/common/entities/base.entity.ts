/**
 * Base Entity - Common fields for all entities
 */
export abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Base entity with soft delete support for TypeORM
 */
export abstract class BaseEntityWithTimestamps {
  id: string;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  isDeleted: boolean = false;
  deletedAt?: Date;
}
