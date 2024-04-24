import { BPChartEveningObservation } from './bp-eveningObs.model';
import { BPChartMorningObservation } from './bp-morningobs.model';
export class BPChartObservation {
    morningObservation: BPChartMorningObservation;
    eveningObservation: BPChartEveningObservation;
    observationDate: string;
}