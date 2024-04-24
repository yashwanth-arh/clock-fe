export interface PatientsZone {
    "patient": {
        "version"?: number;
        "lastUpdatedAt"?: string | null;
        "id"?: string | null;
        "age"?: number;
        "address": Address;
        "branch": Branch;
        "cellNumber"?: string | null;
        "dob"?: string | null;
        "emrPatientId"?: string | null;
        "firstName"?: string | null;
        "gender"?: string | null;
        "homeNumber"?: string | null;
        "hospitalId"?: string | null;
        "hospitalName"?: string | null;
        "diagnosis"?: string | null;
        "insuranceName"?: string | null;
        "insuranceNo"?: string | null;
        "insuranceType"?: string | null;
        "icdCodeIds"?: string | null;
        "primaryDiagnosis"?: string | null;
        "secondaryDiagnosis"?: string | null;
        "primaryicdcode"?: string | null;
        "secondaryicdcode"?: string | null;
        "lastName"?: string | null;
        "phoneCode"?: string | null;
        "diastolicBloodPressure"?: string | null;
        "middleName"?: string | null;
        "personalEmail"?: string | null;
        "primaryPhysician": PrimaryPhysician;
        "ssn"?: string | null;
        "systolicBloodPressure"?: string | null;
        "userStatus"?: string | null;
        "height"?: string | null;
        "weight"?: string | null;
        "dryWeight"?: string | null;
        "lastDialysisDate"?: string | null;
        "nextDialysisDate"?: string | null;
        "duration"?: string | null;
        "insuranceData": InsuranceData;
        "flag"?: boolean | null;
        "diagnosisCodes"?: string | null;
        "medicareNumber"?: string | null;
        "medicareAdvantageInsurer"?: string | null;
        "medAdvIndividualNumber"?: string | null;
        "medAdvGroupNumber"?: string | null;
        "rpmTime"?: string | null;
        "profileurl"?: string | null;
        "bpDeviceId"?: string | null;
        "wtDeviceId"?: string | null;
        "bsDeviceId"?: string | null;
        "emergencyContactNumber"?: string | null;
        "idp"?:  string | null;
        "readingExist"?: number;
        "clinicBp"?:  string | null;
        "clinicBg"?:  string | null;
        "clinicWeight"?:  string | null;
        "clinicPulse"?:  string | null;
        "hbA1c"?:  string | null
        "lastBpUpdatedDate"?:  string | null;
        "lastBgUpdatedDate"?:  string | null;
        "zoneOfPatient"?: number
    };
    "patientObsBP": PatientObsBP;
    "patientObsWt"?: null;
    "patientObsBs": PatientObsBs;
    "remark"?: null;
    "appointmentRequest"?: null;
    "appointmentDate"?: number | null
}

export interface Address {
    "addressLine"?: string | null;
    "city"?: string | null;
    "state"?: string | null;
    "country"?: string | null;
    "zipCode": number
}

export interface hospital {
    "version": number;
    "lastUpdatedAt"?: string | null;
    "id"?: string | null;
    "name"?: string | null;
    "emailId"?: string | null;
    "contactNumber"?: string | null;
    "status"?: string | null;
    "address": Address;
    "practiceNPI"?: string | null;
    "noOfBranches"?: number | null;
    "noOfAdmins"?: number | null
}

export interface PrimaryPhysician {
    "version": number;
    "lastUpdatedAt"?: string | null;
    "id"?: string | null;
    "name"?: string | null;
    "specializations"?: string | null;
    "address": Address;
    "homeNumber"?: string | null;
    "cellNumber"?: string | null;
    "emailId"?: string | null;
    "docNPI"?: string | null;
    "locNPI"?: string | null;
    "hospital": hospital;
    "clinicNames"?: string | null;
    "clinicIds"?: string | null;
    "clinics"?: string | null;
    "userStatus"?: string | null;
    "profileurl"?: string | null
}

  export interface InsuranceData {
    "id"?: string | null;
    "insuranceName"?: string | null;
    "insuranceno"?: string | null;
    "medicareNumber"?: string | null;
    "medicareAdvantageInsurer"?: string | null;
    "medAdvIndividualNumber"?: string | null;
    "medAdvGroupNumber"?: string | null
  }

  export interface ClinicTiming {
    "clinicId"?: string | null;
    "patientId"?: string | null;
    "session1From"?: string | null;
    "session1To"?: string | null;
    "session1ContactNumber"?: string | null;
    "session2From"?: string | null;
    "session2To"?: string | null;
    "session2ContactNumber"?: string | null;
    "branches"?: string | null
  }

  export interface PatientObsBs {
    "id"?:  string | null;
    "patientId"?:  string | null;
    "readingId"?:  string | null;
    "presentBSreading"?:  string | null;
    "bsResult"?:  string | null;
    "symptomsBS"?: string | null;
    "status"?:  string | null;
    "createdAt"?:  string | null;
    "zoneOfPat"?:  string | null;
    "symptom"?:  string | null;
    "opted_911"?:  string | null;
    "emergencyrequired_911"?:  string | null
  }

export interface PatientObsBP {
    "id"?: string | null;
    "patientId"?: string | null;
    "presentBp"?: string | null;
    "presentPulse"?: string | null;
    "bpResult"?: string | null;
    "symptomsBp"?:  string | null
    "status"?:  string | null;
    "createdAt"?:  string | null;
    "zoneOfPat"?:  string | null;
    "timepostdialysis"?: null;
    "readingId"?:  string | null;
    "baselineBp"?:  string | null;
    "called_911"?:  string | null;
    "symptom"?:  string | null;
    "emergencyrequired_911"?:  string | null;
    "opted_911"?:  string | null
  }

export interface  Branch {
    "version"?: number;
    "lastUpdatedAt" ?: string | null;
    "id"?: string | null;
    "name"?: string | null;
    "emailId"?: string | null;
    "primaryContactNumber"?: string | null;
    "primaryContactPersonName"?: string | null;
    "primaryPersonContactNumber"?: string | null;
    "emergencyContactNumber"?: string | null;
    "address": Address;
    "branchType"?: string | null;
    "hospital": hospital;
    "status"?: string | null;
    "clinicNPI"?: string | null;
    "noOfAdmins"?: number | null;
    "clinicTiming": ClinicTiming;
    "branchUser"?: string | null
  }