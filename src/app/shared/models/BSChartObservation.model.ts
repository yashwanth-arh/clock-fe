import { BloodSugarChartEveningObservation } from "./bs-eveningObs.model";
import { BloodSugarChartMorningObservation } from "./bs-morningObs.model";

export class BSChartObservation {
    morningObservation: BloodSugarChartMorningObservation;
    eveningObservation: BloodSugarChartEveningObservation;
    observationDate: string;
}