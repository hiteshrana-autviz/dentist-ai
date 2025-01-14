import { Tooth } from "./tooth";

export interface PeriodontalChart {
    id?: string; // Optional for new charts
    tenantId: string;
    patientId: string;
    chartDate: Date;
    teeth: Tooth[];
}

export interface PeriodontalChartDto {
    id: string; // Use string for the client-side representation
    patientID: string;
    tenantId: string;
    chartDate: Date; // Date of the chart
    isDeleted: boolean; // Indicates if the chart is deleted
    teeth: Tooth[]; // List of teeth details
}

export interface PatientData {
    toothNumber? : number;
    Distal_Buccal?: string | null;
    Buccal?: string | null;
    Mesial_Buccal?: string | null;
    Distal_Lingual?: string | null;
    Lingual?: string | null;
    Mesial_Lingual?: string | null;
    Distal_Facial?: string | null;
    Facial?: string | null;
    Mesial_Facial?: string | null;
    Distal_Palatal?: string | null;
    Palatal?: string | null;
    Mesial_Palatal?: string | null;
  }
  
  