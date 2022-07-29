import { MigrationInterface, QueryRunner } from "typeorm";

export class sh1658975277535 implements MigrationInterface {
    name = 'sh1658975277535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_saved_posts_post" ("saved_posts" uuid NOT NULL, "saved" uuid NOT NULL, CONSTRAINT "PK_252b7a4dff34f23bdd977d1cba5" PRIMARY KEY ("saved_posts", "saved"))`);
        await queryRunner.query(`CREATE INDEX "IDX_923ab1ede121bda15944e070b4" ON "user_saved_posts_post" ("saved_posts") `);
        await queryRunner.query(`CREATE INDEX "IDX_05d9b45a5bc09dda05a4910322" ON "user_saved_posts_post" ("saved") `);
        await queryRunner.query(`CREATE TABLE "post_likes_user" ("post_likes" uuid NOT NULL, "liked_posts" uuid NOT NULL, CONSTRAINT "PK_44d28d9c5fbe903c24511be06b9" PRIMARY KEY ("post_likes", "liked_posts"))`);
        await queryRunner.query(`CREATE INDEX "IDX_df8b2c6438298c5d37bbed7ad0" ON "post_likes_user" ("post_likes") `);
        await queryRunner.query(`CREATE INDEX "IDX_b5e38a8f1ffc4311157d2c12a9" ON "post_likes_user" ("liked_posts") `);
        await queryRunner.query(`ALTER TABLE "user_saved_posts_post" ADD CONSTRAINT "FK_923ab1ede121bda15944e070b44" FOREIGN KEY ("saved_posts") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_saved_posts_post" ADD CONSTRAINT "FK_05d9b45a5bc09dda05a49103227" FOREIGN KEY ("saved") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_likes_user" ADD CONSTRAINT "FK_df8b2c6438298c5d37bbed7ad00" FOREIGN KEY ("post_likes") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_likes_user" ADD CONSTRAINT "FK_b5e38a8f1ffc4311157d2c12a98" FOREIGN KEY ("liked_posts") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_likes_user" DROP CONSTRAINT "FK_b5e38a8f1ffc4311157d2c12a98"`);
        await queryRunner.query(`ALTER TABLE "post_likes_user" DROP CONSTRAINT "FK_df8b2c6438298c5d37bbed7ad00"`);
        await queryRunner.query(`ALTER TABLE "user_saved_posts_post" DROP CONSTRAINT "FK_05d9b45a5bc09dda05a49103227"`);
        await queryRunner.query(`ALTER TABLE "user_saved_posts_post" DROP CONSTRAINT "FK_923ab1ede121bda15944e070b44"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5e38a8f1ffc4311157d2c12a9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df8b2c6438298c5d37bbed7ad0"`);
        await queryRunner.query(`DROP TABLE "post_likes_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_05d9b45a5bc09dda05a4910322"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_923ab1ede121bda15944e070b4"`);
        await queryRunner.query(`DROP TABLE "user_saved_posts_post"`);
    }

}
