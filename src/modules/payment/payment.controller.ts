import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Observable } from 'rxjs';
import { ChargeResponse, CreateChargeDto } from './dto/charge.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(
    @Body() createPaymentDto: CreateChargeDto
  ): Observable<ChargeResponse> {
    return this.paymentService.create(createPaymentDto);
  }

  @Get('/:correlationId')
  findOne(
    @Param('correlationId') correlationId: string
  ): Observable<ChargeResponse> {
    return this.paymentService.findOne(correlationId);
  }
}
