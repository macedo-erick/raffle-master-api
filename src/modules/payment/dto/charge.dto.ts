export enum ChargeStatusEnum {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED'
}

export class Charge {
  value: number;
  correlationID: string;
  status: ChargeStatusEnum;
}

export class ChargeResponse {
  charge: Charge;
}

export class CreateChargeDto {
  value: number;
}
