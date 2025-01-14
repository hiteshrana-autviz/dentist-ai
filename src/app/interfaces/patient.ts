import { BaseEntity } from "./base-entity";


export interface Patient extends BaseEntity {
  tenantId: string; // Identifier for multi-tenancy
  patientId: number | null;
  doctorId: string;
  name: string;
  age: number;
  // gender: string;
  phone: string;
  // email: string;
  dateOfBirth: Date;
}

export interface PatientDto {
  tenantId: string;         // Tenant identifier for multi-tenancy, e.g. "6745601e5e34594ff9d75afb"
  patientId: number;        // Patient's unique identifier number, e.g. 101
  doctorId: string;         // Doctor's identifier, e.g. "67456c3bb01a3c1f2fa5cdfc"
  name: string;             // Patient's name, e.g. "Akash"
  age: number;              // Patient's age, e.g. 0
  phone: string;            // Patient's phone number, e.g. "33444"
  dateOfBirth: string;      // Patient's date of birth in ISO format, e.g. "2024-12-29T18:30:00Z"
  isDeleted: boolean;       // Whether the patient is deleted, e.g. false
  createdAt: string;        // Creation timestamp in ISO format, e.g. "2024-12-03T07:22:28.856Z"
  updatedAt: string;        // Update timestamp in ISO format, e.g. "2024-12-03T07:22:28.856Z"
  id?: string;
}
