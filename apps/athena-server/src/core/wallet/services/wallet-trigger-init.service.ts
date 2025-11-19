
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class WalletTriggerInitService implements OnModuleInit {
  constructor(@InjectDataSource() private dataSource: DataSource) { }

  async onModuleInit() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // Create function to block direct balance updates
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_proc WHERE proname = 'prevent_direct_balance_update'
        ) THEN
          CREATE OR REPLACE FUNCTION prevent_direct_balance_update()
          RETURNS trigger AS $$
          BEGIN
            RAISE EXCEPTION 'Direct wallet balance updates are not allowed. Use transactions instead.';
            RETURN NULL;
          END;
          $$ LANGUAGE plpgsql;
        END IF;
      END;
      $$;
    `);

    // 2️⃣ Attach trigger to wallet table
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'wallet_balance_guard'
        ) THEN
          CREATE TRIGGER wallet_balance_guard
          BEFORE UPDATE OF balance ON wallet
          FOR EACH ROW
          EXECUTE FUNCTION prevent_direct_balance_update();
        END IF;
      END;
      $$;
    `);

    await queryRunner.release();
  }
}
