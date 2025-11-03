import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AthenaConfigModule } from "src/engine/athena-config/athena-config.module";
import { AthenaConfigService } from "src/engine/athena-config/athena-config.service";
import { NodeEnvironment } from "src/engine/athena-config/enums/node-environment.enum";

@Module({
  imports: [
    TypeOrmModule.forRootAsync(
      {
        imports: [AthenaConfigModule],
        inject: [AthenaConfigService],
        useFactory: (config: AthenaConfigService) => {
          return {

            type: 'postgres',

            host: config.get('DATABASE_HOST'),
            port: +config.get("DATABASE_PORT"),
            username: config.get("DATABASE_USER"),
            password: config.get("DATABASE_PASSWORD"),
            database: config.get('DATABASE_NAME'),
            //entities: [ process.env.NODE_ENV === NodeEnvironment.PRODUCTION ? 'dist/**/*.entity{.ts,.js}' : 'src/**/*.entity{.ts,.js}',],
            autoLoadEntities: true,
            synchronize: true,
            migrationRun: false,
            migrationTableName: "_typeorm_migrations",

            migrations: [
              process.env.NODE_ENV === 'test' ? 'src/database/migrations/*{.ts,.js}' : 'dist/database/migrations/*{.ts,.js}'
            ],
            ssl: config.get("DATABASE_SSL")

          }
        },

      }
    ),


  ],
  exports: [DatabaseModule]

})
export class DatabaseModule { }
