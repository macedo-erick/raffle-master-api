export class CreateTicketsDto {
  raffleId: string;
  quantity: number;
}

export interface SendTicketToQueueRequest {
  raffleId: string;
  quantity: number;
  userId: string;
}
