import { AlertType } from '../entities/alert.enum';


export class Alert {
  id: string;
  type: AlertType;
  message: string;
  autoClose: boolean;
  keepAfterRouteChange: boolean;
  fade: boolean;
  constructor(init?: Partial<Alert>) {
    Object.assign(this, init);
  }

}
