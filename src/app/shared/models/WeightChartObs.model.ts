import { WeightChartEveningObservation } from './weight-eveningObs.model';
import { WeightChartMorningObservation } from './weight-morningObs.model';
export class WeightChartObservation {
    morningObservation: WeightChartMorningObservation;
    eveningObservation: WeightChartEveningObservation;
    observationDate: string;
}