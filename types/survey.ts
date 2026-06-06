// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Survey Form TypeScript Definitions
// Falkon Water Tank Cleaning Service
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Section 1: Survey Information
export interface SurveyInformation {
  surveyDate: string;
  surveyorName: string;
  surveyorId: string;
  societyArea: string;
  gpsCoordinates: GPSCoordinates | null;
}

export interface GPSCoordinates {
  lat: number;
  lng: number;
}

// Section 2: House Information
export type FloorType = "Ground" | "1st" | "2nd" | "3rd" | "4th+";

export interface HouseInformation {
  houseFlatNumber: string;
  floor: FloorType | "";
}

// Section 3: Customer Details
export interface CustomerDetails {
  mobileNumber: string;
  customerName: string;
  emailId: string;
}

// Section 4: Water Tank Details
export type TankType = "Overhead" | "Underground" | "Both";
export type TankMaterial = "Plastic" | "RCC/Cement" | "Steel" | "FRP/Fibre" | "Other";
export type TotalTanks = "1" | "2" | "3" | "4" | "5+";
export type TankCapacity = "500L" | "1000L" | "2000L" | "5000L" | "Above 5000L";
export type LastCleaning =
  | "Within 6 Months"
  | "6–12 Months Ago"
  | "More Than 1 Year Ago"
  | "Never Cleaned";

export interface WaterTankDetails {
  tankType: TankType | "";
  tankMaterials: TankMaterial[];
  otherMaterial: string;
  totalTanks: TotalTanks | "";
  tankCapacity: TankCapacity | "";
  totalWaterStorage: number;
  lastCleaning: LastCleaning | "";
}

// Section 5: Tank Health Check
export type WaterCondition =
  | "Clear"
  | "Slightly Dirty"
  | "Dirty"
  | "Bad Smell";

export interface TankHealthCheck {
  isDirty: boolean | null;
  isLidBroken: boolean | null;
  isDamaged: boolean | null;
  isMosquitoPresent: boolean | null;
  waterCondition: WaterCondition | "";
}

// Section 6: Photo Documentation
export type PhotoCategory =
  | "Tank Exterior"
  | "Tank Interior"
  | "Lid Condition"
  | "Leakage/Damage"
  | "Water Quality Condition";

export interface PhotoFile {
  file: File;
  preview: string;
  id: string;
}

export interface PhotoDocumentation {
  photos: PhotoFile[];
  photoCategories: PhotoCategory[];
  customerConsent: boolean | null;
}

// Section 7: Customer Response
export type CustomerDecision =
  | "Book On Spot"
  | "Need More Information"
  | "Call Later"
  | "Not Interested";

export type ServiceRequired =
  | "Tank Cleaning"
  | "Tank Repair"
  | "Lid Replacement"
  | "Water Quality Check"
  | "Not Required";

export type LeadPriority = "Hot Lead" | "Warm Lead" | "Cold Lead";

export interface CustomerResponse {
  customerDecision: CustomerDecision | "";
  servicesRequired: ServiceRequired[];
  preferredServiceDate: string;
  leadPriority: LeadPriority;
}

// Section 8: Surveyor Remarks
export interface SurveyorRemarks {
  remarks: string;
}

// Section 9: Declaration
export interface Declaration {
  accepted: boolean;
  signatureName: string;
  declarationDate: string;
}

// Full form state
export interface SurveyFormData {
  surveyInformation: SurveyInformation;
  houseInformation: HouseInformation;
  customerDetails: CustomerDetails;
  waterTankDetails: WaterTankDetails;
  tankHealthCheck: TankHealthCheck;
  photoDocumentation: PhotoDocumentation;
  customerResponse: CustomerResponse;
  surveyorRemarks: SurveyorRemarks;
  declaration: Declaration;
}

// Submission payload (what goes to Convex)
export interface SurveySubmissionPayload {
  surveyorId: string;
  surveyorName: string;
  surveyDate: string;
  societyArea: string;
  gpsCoordinates: GPSCoordinates | null;
  houseFlatNumber: string;
  floor: string;
  mobileNumber: string;
  customerName: string;
  emailId: string;
  tankType: string;
  tankMaterials: string[];
  otherMaterial: string;
  totalTanks: string;
  tankCapacity: string;
  totalWaterStorage: number;
  lastCleaning: string;
  isDirty: boolean | null;
  isLidBroken: boolean | null;
  isDamaged: boolean | null;
  isMosquitoPresent: boolean | null;
  waterCondition: string;
  photoCategories: string[];
  customerConsent: boolean | null;
  numberOfPhotos: number;
  customerDecision: string;
  servicesRequired: string[];
  preferredServiceDate: string;
  leadPriority: string;
  remarks: string;
  declarationAccepted: boolean;
  signatureName: string;
  timestamp: number;
}

// Section completion tracking
export interface SectionStatus {
  id: number;
  title: string;
  isComplete: boolean;
}

// Society/Area option from Convex
export interface SocietyOption {
  _id: string;
  name: string;
  area: string;
}
