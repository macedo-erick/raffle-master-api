import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { HttpService } from '@nestjs/axios';
import { catchError, map, Observable } from 'rxjs';
import { ChargeResponse, CreateChargeDto } from './dto/charge.dto';

@Injectable()
export class PaymentService {
  private readonly BASE_URL = 'api/v1/charge';

  constructor(private readonly httpService: HttpService) {}

  create(createPaymentDto: CreateChargeDto): Observable<ChargeResponse> {
    const body = {
      correlationID: uuidv4(),
      value: Math.floor(createPaymentDto.value * 100),
      expiresIn: 3600
    };

    return this.httpService.post(this.BASE_URL, body).pipe(
      map((res) => res.data),
      catchError((err) => {
        console.log(err);
        return err;
      })
    );
  }

  findOne(correlationId: string): Observable<ChargeResponse> {
    return this.httpService
      .get(this.BASE_URL.concat('/').concat(correlationId))
      .pipe(map((res) => res.data));
  }
}
