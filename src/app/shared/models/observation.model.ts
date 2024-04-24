import { MorningObservation } from './morningObservation.model'
import { EveningObservation } from './eveningObservation.model';

export class DayObservation {
    morningObservation: MorningObservation;
    eveningObservation: EveningObservation;
    observationDate: string;
}

// export interface MorningObservation {
//     presentWt?: string
//     wtResult?: string
//     symptomsWt?: string
//     permittedWeightlwr?: string
//     permittedWeighthgr?: string
//     timepostdialysis?: string
//     presentBp?: string
//     bpResult?: string
//     symptomsBp?: string
//     status?: string
//     zoneOfPat?: string
//     createdAt?: string
//     weightZoneofPatient?:string
//     BPZoneofPatient?:string
//     weightCreatedAt?:string
//     BPCreatedAt?:string

// }
// export interface EveningObservation {
//     presentWt?: string
//     wtResult?: string
//     symptomsWt?: string
//     permittedWeightlwr?: string
//     permittedWeighthgr?: string
//     timepostdialysis?: string
//     presentBp?: string
//     bpResult?: string
//     symptomsBp?: string
//     status?: string
//     zoneOfPat?: string
//     createdAt?: string
//     weightZoneofPatient?:string
//     BPZoneofPatient?:string
//     weightCreatedAt?:string
//     BPCreatedAt?:string
// }
// }
