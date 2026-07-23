import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangesController } from './exchanges.controller';
import { ExchangesService } from './exchanges.service';
import { Exchange } from './exchange.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exchange])],
  controllers: [ExchangesController],
  providers: [ExchangesService],
  exports: [ExchangesService],
})
export class ExchangesModule {}
