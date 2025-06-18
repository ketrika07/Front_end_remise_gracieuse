export class Notification {
  id: number;
  type: string;
  message: string;
  dateEnvoi: Date;

  constructor(
    id: number,
    type: string,
    message: string,
    dateEnvoi: Date,
  ) {
    this.id = id;
    this.type = type;
    this.message = message;
    this.dateEnvoi = dateEnvoi;
  }
}
