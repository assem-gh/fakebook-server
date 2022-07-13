import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1657331377581 implements MigrationInterface {
  name = 'createUserTable1657331377581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "profile_image" character varying NOT NULL DEFAULT 'https://villagesonmacarthur.com/wp-content/uploads/2020/12/Blank-Avatar.png', "gender" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "bio" character varying, "birthday" date NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_d34106f8ec1ebaf66f4f8609dd6" UNIQUE ("user_name"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d34106f8ec1ebaf66f4f8609dd" ON "user" ("user_name") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d34106f8ec1ebaf66f4f8609dd"`
    );
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
