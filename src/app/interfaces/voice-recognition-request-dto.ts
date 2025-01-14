export interface VoiceRecognitionRequestDto {
  patientId: string;
  doctorId: string;
  chartId: string;
  tenantId: string;
  audioFile: File;
}
