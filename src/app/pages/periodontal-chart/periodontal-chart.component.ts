import { CommonModule } from '@angular/common';

import { BaseDestroyCompoent } from '../../shared/utils/basedestroy';
import { PeriodontalChartService } from '../../core/services/periodontal-chart.service';
import { finalize, takeUntil } from 'rxjs';
import {
  PeriodontalChart,
  PeriodontalChartDto,
} from '../../interfaces/periodontal-chart';
import {
  AddOrUpdateTeethDto,
  Bleeding,
  clinicalAttachmentLevel,
  GingivalMargin,
  MucogingivalJunction,
  PocketDepth,
  Suppuration,
  Tooth,
} from '../../interfaces/tooth';
import { SpeechRecognitionService } from '../../core/services/speech-recognition.service';
import { VoiceRecognitionRequest } from '../../interfaces/voice-recognition-request';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../core/services/notifications.service';
import { SignalRService } from '../../core/services/signalR.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SessionService } from '../../core/services/session.service';
import { UserDto } from '../../interfaces/user-dto';
import { Router } from '@angular/router';
import { VoiceRecognitionRequestDto } from '../../interfaces/voice-recognition-request-dto';

@Component({
  selector: 'app-periodontal-chart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './periodontal-chart.component.html',
  styleUrl: './periodontal-chart.component.scss',
})
export class PeriodontalChartComponent
  extends BaseDestroyCompoent
  implements OnInit
{
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private silenceTimeout: any;
  private silenceThreshold: number = 4000;
  addOrUpdateTeethDto: AddOrUpdateTeethDto | undefined;
  isEditMode: boolean = false;
  distalBuccal: number | null | undefined;
  buccal: number | null | undefined;
  mesialBuccal: number | null | undefined;
  distalLingual: number | null | undefined;
  lingual: number | null | undefined;
  mesialLingual: number | null | undefined;

  distalFacial: number | null | undefined;
  facial: number | null | null | undefined;
  mesialFacial: number | null | undefined;
  distalPalatial: number | null | undefined;
  palatial: number | null | undefined;
  mesialPalatial: number | null | undefined;
  @Input() patientId: string = '';
  periodontalChart: PeriodontalChart | undefined;
  chart!: PeriodontalChartDto[];
  tenantId: string = ''; // Initialize with appropriate value
  doctorId: string = '';
  teeth: Tooth[] = []; //
  transcript: string = '';
  transcripts: string[] = [];
  isRecording: boolean = false;
  @Input() chartId: string = '';
  pdValues: PocketDepth[] = [];
  gmValues: GingivalMargin[] = [];
  calValues: clinicalAttachmentLevel[] = [];
  bleedingValues: Bleeding[] = [];
  suppurationValues: Suppuration[] = [];
  mgjValues: MucogingivalJunction[] = [];
  user: UserDto | undefined;
  isChartSave: boolean = false;
  private silenceDuration: number = 4000; // Silence threshold in milliseconds (4 seconds)
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private stream: MediaStream | null = null;
  private isSilent = false;

  constructor(
    private _periodontalChartService: PeriodontalChartService,
    private speechService: SpeechRecognitionService,
    private notificationService: NotificationsService,
    private cdr: ChangeDetectorRef,
    private sessionService: SessionService,
    private signalService: SignalRService,
    private authService: AuthService,
    private route: Router
  ) {
    super();

    this.signalService.getNotifications().subscribe((message: string) => {
      if (message !== null) {
        this.transcript = this.transcript.concat(message);
        this.processTranscript(message);
      }
    });
    this.tenantId = this.authService.getTenantIdFromCookie() || '';
  }
  ngOnInit(): void {
    this.sessionService.getCurrentUser().subscribe((res) => {
      this.user = res.data;
      this.doctorId = this.user.id;
    });
    this.getPatientChart();
    this.generatePdValues();
    this.generateBleedingValues();
    this.generateGmValues();
    this.generateCalValues();
    this.generateSuppurationValues();
    this.generateMgjValues();
  }
  generatePdValues() {
    this.pdValues = []; // Reset the array before pushing values
    for (let i = 1; i <= 32; i++) {
      this.pdValues.push({
        toothNumber: i,
        // pocketDepthBuccalLeft: 0,
        // pocketDepthBuccalCenter: 0,
        // pocketDepthBuccalRight: 0,
        // pocketDepthLingualLeft: 0,
        // pocketDepthLingualCenter: 0,
        // pocketDepthLingualRight: 0,

        // Properties for teeth 1-5, 12-21, 28-32
        distalBuccal: 0,
        buccal: 0,
        mesialBuccal: 0,
        distalLingual: 0,
        lingual: 0,
        mesialLingual: 0,

        // Properties for teeth 6-11, 22-27
        distalFacial: 0,
        facial: 0,
        mesialFacial: 0,
        distalPalatial: 0,
        palatial: 0,
        mesialPalatial: 0,
      });
    }
  }

  // Generate Gingival Margin Values
  generateGmValues() {
    this.gmValues = []; // Reset the array before pushing values
    for (let i = 1; i <= 32; i++) {
      this.gmValues.push({
        toothNumber: i,
        gingivalMarginBuccalLeft: null,
        gingivalMarginBuccalCenter: null,
        gingivalMarginBuccalRight: null,
        gingivalMarginLingualLeft: null,
        gingivalMarginLingualCenter: null,
        gingivalMarginLingualRight: null,
      });
    }
  }

  // Generate Clinical Attachment Level Values
  generateCalValues() {
    this.calValues = []; // Reset the array before pushing values
    for (let i = 1; i <= 32; i++) {
      this.calValues.push({
        toothNumber: i,
        clinicalAttachmentLevelBuccalLeft: null,
        clinicalAttachmentLevelBuccalCenter: null,
        clinicalAttachmentLevelBuccalRight: null,
        clinicalAttachmentLevelLingualLeft: null,
        clinicalAttachmentLevelLingualCenter: null,
        clinicalAttachmentLevelLingualRight: null,
      });
    }
  }

  // Generate Bleeding Values
  generateBleedingValues() {
    this.bleedingValues = []; // Reset the array before pushing values
    for (let i = 1; i <= 32; i++) {
      this.bleedingValues.push({
        toothNumber: i,
        isBleedingBuccalLeft: false,
        isBleedingBuccalCenter: false,
        isBleedingBuccalRight: false,
        isBleedingLingualLeft: false,
        isBleedingLingualCenter: false,
        isBleedingLingualRight: false,
      });
    }
  }

  // Generate Suppuration Values
  generateSuppurationValues() {
    this.suppurationValues = []; // Reset the array before pushing values
    for (let i = 1; i <= 32; i++) {
      this.suppurationValues.push({
        toothNumber: i,
        isSuppurationBuccalLeft: false,
        isSuppurationBuccalCenter: false,
        isSuppurationBuccalRight: false,
        isSuppurationLingualLeft: false,
        isSuppurationLingualCenter: false,
        isSuppurationLingualRight: false,
      });
    }
  }

  generateMgjValues() {
    this.mgjValues = []; // Reset the array before pushing values
    for (let i = 1; i <= 32; i++) {
      this.mgjValues.push({
        toothNumber: i,
        mucogingivalJunctionBuccalLeft: null,
        mucogingivalJunctionBuccalCenter: null,
        mucogingivalJunctionBuccalRight: null,
        mucogingivalJunctionLingualLeft: null,
        mucogingivalJunctionLingualCenter: null,
        mucogingivalJunctionLingualRight: null,
      });
    }
  }

  getPatientChart() {
    if (this.patientId)
      this._periodontalChartService
        .getChartsByPatientAndTenantId(this.patientId, this.tenantId)
        .subscribe(
          (response) => {
            if (response.success) {
              this.chart = response.chart;
              this.chartId = response.chart[0].id;
              this.tenantId = response.chart[0].tenantId;
              this.updateValuesFromCharts();
            } else {
              this.isChartSave = true;
              this.saveChart();
            }
          },
          (error) => {
            console.error('Error fetching charts:', error);
          }
        );
  }

  updateValuesFromCharts() {
    // Limit iteration count to 32 and update values
    this.chart[0].teeth.slice(0, 32).forEach((tooth) => {
      // Update PD Values
      const pdIndex = this.pdValues.findIndex(
        (item) => item.toothNumber === tooth.toothNumber
      );
      if (pdIndex !== -1) {
        this.pdValues[pdIndex] = { ...this.pdValues[pdIndex], ...tooth };
      }

      // Update GM Values
      const gmIndex = this.gmValues.findIndex(
        (item) => item.toothNumber === tooth.toothNumber
      );
      if (gmIndex !== -1) {
        this.gmValues[gmIndex] = { ...this.gmValues[gmIndex], ...tooth };
      }

      // Update CAL Values
      const calIndex = this.calValues.findIndex(
        (item) => item.toothNumber === tooth.toothNumber
      );
      if (calIndex !== -1) {
        this.calValues[calIndex] = { ...this.calValues[calIndex], ...tooth };
      }

      // Update Bleeding Values
      const bleedingIndex = this.bleedingValues.findIndex(
        (item) => item.toothNumber === tooth.toothNumber
      );
      if (bleedingIndex !== -1) {
        this.bleedingValues[bleedingIndex] = {
          ...this.bleedingValues[bleedingIndex],
          ...tooth,
        };
      }

      // Update Suppuration Values
      const suppurationIndex = this.suppurationValues.findIndex(
        (item) => item.toothNumber === tooth.toothNumber
      );
      if (suppurationIndex !== -1) {
        this.suppurationValues[suppurationIndex] = {
          ...this.suppurationValues[suppurationIndex],
          ...tooth,
        };
      }

      // Update MGJ Values
      const mgjIndex = this.mgjValues.findIndex(
        (item) => item.toothNumber === tooth.toothNumber
      );
      if (mgjIndex !== -1) {
        this.mgjValues[mgjIndex] = { ...this.mgjValues[mgjIndex], ...tooth };
      }
    });

    // Sort arrays by toothNumber
    this.pdValues.sort((a, b) => a.toothNumber - b.toothNumber);
    this.gmValues.sort((a, b) => a.toothNumber - b.toothNumber);
    this.calValues.sort((a, b) => a.toothNumber - b.toothNumber);
    this.bleedingValues.sort((a, b) => a.toothNumber - b.toothNumber);
    this.suppurationValues.sort((a, b) => a.toothNumber - b.toothNumber);
    this.mgjValues.sort((a, b) => a.toothNumber - b.toothNumber);

    // Limit the arrays to the first 32 entries
    this.pdValues = this.pdValues.slice(0, 32);
    this.gmValues = this.gmValues.slice(0, 32);
    this.calValues = this.calValues.slice(0, 32);
    this.bleedingValues = this.bleedingValues.slice(0, 32);
    this.suppurationValues = this.suppurationValues.slice(0, 32);
    this.mgjValues = this.mgjValues.slice(0, 32);
  }

  calculateCAL(value: any): void {
    const toothNumber = value.toothNumber;
    // Find the corresponding PD and GM values based on the tooth number
    const pdValue = this.pdValues.find(
      (item) => item.toothNumber === toothNumber
    );
    const gmValue = this.gmValues.find(
      (item) => item.toothNumber === toothNumber
    );

    // Find the index in the calValues array to update the CAL for the specific tooth
    const calIndex = this.calValues.findIndex(
      (item) => item.toothNumber === toothNumber
    );

    // if (calIndex !== -1 && pdValue && gmValue) {
    //   // Calculate CAL for each region (Buccal and Lingual) using PD and GM values
    //   this.calValues[calIndex].clinicalAttachmentLevelBuccalLeft =
    //     (pdValue.pocketDepthBuccalLeft ?? 0) +
    //     (gmValue.gingivalMarginBuccalLeft ?? 0);

    //   this.calValues[calIndex].clinicalAttachmentLevelBuccalCenter =
    //     (pdValue.pocketDepthBuccalCenter ?? 0) +
    //     (gmValue.gingivalMarginBuccalCenter ?? 0);

    //   this.calValues[calIndex].clinicalAttachmentLevelBuccalRight =
    //     (pdValue.pocketDepthBuccalRight ?? 0) +
    //     (gmValue.gingivalMarginBuccalRight ?? 0);

    //   this.calValues[calIndex].clinicalAttachmentLevelLingualLeft =
    //     (pdValue.pocketDepthLingualLeft ?? 0) +
    //     (gmValue.gingivalMarginLingualLeft ?? 0);

    //   this.calValues[calIndex].clinicalAttachmentLevelLingualCenter =
    //     (pdValue.pocketDepthLingualCenter ?? 0) +
    //     (gmValue.gingivalMarginLingualCenter ?? 0);

    //   this.calValues[calIndex].clinicalAttachmentLevelLingualRight =
    //     (pdValue.pocketDepthLingualRight ?? 0) +
    //     (gmValue.gingivalMarginLingualRight ?? 0);
    //   this.cdr.detectChanges();
    //   console.log(
    //     `Updated CAL for Tooth Number ${toothNumber}:`,
    //     this.calValues[calIndex]
    //   );
    // } else {
    //   // If the PD or GM value is not found, log a warning message
    //   console.warn(
    //     `Tooth with number ${toothNumber} not found in PD or GM values.`
    //   );
    // }
  }
  assignToothProperties(pd: PocketDepth) {
    if (
      [
        1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 28, 29, 30, 31,
        32,
      ].includes(pd.toothNumber)
    ) {
      // Properties for teeth 1-5, 12-21, 28-32
      this.distalBuccal = pd.distalBuccal;
      this.buccal = pd.buccal;
      this.mesialBuccal = pd.mesialBuccal;
      this.distalLingual = pd.distalLingual;
      this.lingual = pd.lingual;
      this.mesialLingual = pd.mesialLingual;
    } else if (
      [6, 7, 8, 9, 10, 11, 22, 23, 24, 25, 26, 27].includes(pd.toothNumber)
    ) {
      // Properties for teeth 6-11, 22-27
      this.distalFacial = pd.distalFacial;
      this.facial = pd.facial;
      this.mesialFacial = pd.mesialFacial;
      this.distalPalatial = pd.distalPalatial;
      this.palatial = pd.palatial;
      this.mesialPalatial = pd.mesialPalatial;
    }
  }
  saveChart() {
    this.teeth = this.pdValues.map((pd) => {
      const gm = this.gmValues.find(
        (item) => item.toothNumber === pd.toothNumber
      );
      const cal = this.calValues.find(
        (item) => item.toothNumber === pd.toothNumber
      );
      const bleeding = this.bleedingValues.find(
        (item) => item.toothNumber === pd.toothNumber
      );
      const suppuration = this.suppurationValues.find(
        (item) => item.toothNumber === pd.toothNumber
      );
      const mgj = this.mgjValues.find(
        (item) => item.toothNumber === pd.toothNumber
      );
      // Conditional properties for specific teeth number ranges (1-5, 12-21, 28-32)
      let distalBuccal,
        buccal,
        mesialBuccal,
        distalLingual,
        lingual,
        mesialLingual;
      let distalFacial,
        facial,
        mesialFacial,
        distalPalatial,
        palatial,
        mesialPalatial;

      // Define properties based on the tooth number range
      if (
        [
          1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 28, 29, 30, 31,
          32,
        ].includes(pd.toothNumber)
      ) {
        // Properties for teeth 1-5, 12-21, 28-32
        distalBuccal = pd.distalBuccal;
        buccal = pd.buccal;
        mesialBuccal = pd.mesialBuccal;
        distalLingual = pd.distalLingual;
        lingual = pd.lingual;
        mesialLingual = pd.mesialLingual;
      }

      if (
        [6, 7, 8, 9, 10, 11, 22, 23, 24, 25, 26, 27].includes(pd.toothNumber)
      ) {
        // Properties for teeth 6-11, 22-27
        distalFacial = pd.distalFacial;
        facial = pd.facial;
        mesialFacial = pd.mesialFacial;
        distalPalatial = pd.distalPalatial;
        palatial = pd.palatial;
        mesialPalatial = pd.mesialPalatial;
      }
      return {
        hasImplant: false,
        isMissingTooth: false,
        // tenantId: this.tenantId,
        // chartId: this.chartId,
        toothNumber: pd.toothNumber,
        notes: '',
        mobilityGrade: pd.mobilityGrade,

        // Specific tooth properties based on tooth number
        distalBuccal: distalBuccal || 0,
        buccal: buccal || 0,
        mesialBuccal: mesialBuccal || 0,
        distalLingual: distalLingual || 0,
        lingual: lingual || 0,
        mesialLingual: mesialLingual || 0,

        distalFacial: distalFacial || 0,
        facial: facial || 0,
        mesialFacial: mesialFacial || 0,
        distalPalatial: distalPalatial || 0,
        palatial: palatial || 0,
        mesialPalatial: mesialPalatial || 0,
        // pocketDepthBuccalLeft: pd.pocketDepthBuccalLeft,
        // pocketDepthBuccalCenter: pd.pocketDepthBuccalCenter,
        // pocketDepthBuccalRight: pd.pocketDepthBuccalRight,
        // pocketDepthLingualLeft: pd.pocketDepthLingualLeft,
        // pocketDepthLingualCenter: pd.pocketDepthLingualCenter,
        // pocketDepthLingualRight: pd.pocketDepthLingualRight,

        gingivalMarginBuccalLeft: gm?.gingivalMarginBuccalLeft || null,
        gingivalMarginBuccalCenter: gm?.gingivalMarginBuccalCenter || null,
        gingivalMarginBuccalRight: gm?.gingivalMarginBuccalRight || null,
        gingivalMarginLingualLeft: gm?.gingivalMarginLingualLeft || null,
        gingivalMarginLingualCenter: gm?.gingivalMarginLingualCenter || null,
        gingivalMarginLingualRight: gm?.gingivalMarginLingualRight || null,

        clinicalAttachmentLevelBuccalLeft:
          cal?.clinicalAttachmentLevelBuccalLeft || null,
        clinicalAttachmentLevelBuccalCenter:
          cal?.clinicalAttachmentLevelBuccalCenter || null,
        clinicalAttachmentLevelBuccalRight:
          cal?.clinicalAttachmentLevelBuccalRight || null,
        clinicalAttachmentLevelLingualLeft:
          cal?.clinicalAttachmentLevelLingualLeft || null,
        clinicalAttachmentLevelLingualCenter:
          cal?.clinicalAttachmentLevelLingualCenter || null,
        clinicalAttachmentLevelLingualRight:
          cal?.clinicalAttachmentLevelLingualRight || null,

        isBleedingBuccalLeft: bleeding?.isBleedingBuccalLeft || false,
        isBleedingBuccalCenter: bleeding?.isBleedingBuccalCenter || false,
        isBleedingBuccalRight: bleeding?.isBleedingBuccalRight || false,
        isBleedingLingualLeft: bleeding?.isBleedingLingualLeft || false,
        isBleedingLingualCenter: bleeding?.isBleedingLingualCenter || false,
        isBleedingLingualRight: bleeding?.isBleedingLingualRight || false,

        isSuppurationBuccalLeft: suppuration?.isSuppurationBuccalLeft || false,
        isSuppurationBuccalCenter:
          suppuration?.isSuppurationBuccalCenter || false,
        isSuppurationBuccalRight:
          suppuration?.isSuppurationBuccalRight || false,
        isSuppurationLingualLeft:
          suppuration?.isSuppurationLingualLeft || false,
        isSuppurationLingualCenter:
          suppuration?.isSuppurationLingualCenter || false,
        isSuppurationLingualRight:
          suppuration?.isSuppurationLingualRight || false,

        mucogingivalJunctionBuccalLeft:
          mgj?.mucogingivalJunctionBuccalLeft || null,
        mucogingivalJunctionBuccalCenter:
          mgj?.mucogingivalJunctionBuccalCenter || null,
        mucogingivalJunctionBuccalRight:
          mgj?.mucogingivalJunctionBuccalRight || null,
        mucogingivalJunctionLingualLeft:
          mgj?.mucogingivalJunctionLingualLeft || null,
        mucogingivalJunctionLingualCenter:
          mgj?.mucogingivalJunctionLingualCenter || null,
        mucogingivalJunctionLingualRight:
          mgj?.mucogingivalJunctionLingualRight || null,
      };
    });
    const input: AddOrUpdateTeethDto = {
      patientId: this.patientId,
      tenantId: this.tenantId,
      chartId: this.chartId,
      doctorId: this.doctorId,
      teeth: this.teeth,
    };

    this._periodontalChartService.addOrUpdateTeeth(input).subscribe(
      (response) => {
        if (response.success) {
          this.chartId = response.chartId;
          if (!this.isChartSave) {
            this.notificationService.successAlert('Chart saved successfully!');
          }

          console.log('Chart saved successfully!');
          this.isChartSave = false;
        }
      },
      (error) => {
        console.error('Error saving chart:', error);
      }
    );
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startListening();
    }
  }

  processTranscript(transcript: any) {
    let patientData;

    // Check if the message is already an object or a valid JSON string
    if (typeof transcript.message === 'string') {
      try {
        patientData = JSON.parse(transcript.message);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return; // Handle the error gracefully
      }
    } else if (typeof transcript.message === 'object') {
      patientData = transcript.message;
    } else {
      console.error('Invalid data format for patient data.');
      return; // Handle the error gracefully
    }

    // Proceed only if chartId and patientId match
    if (
      this.chartId !== undefined &&
      this.chartId === patientData.chartId &&
      this.patientId &&
      this.patientId === patientData.patientId
    ) {
      // Create a map for quick access to pdValues by toothNumber
      const pdValueMap = new Map(
        this.pdValues.map((item) => [item.toothNumber, item])
      );

      for (const toothNumber in patientData.patient) {
        if (patientData.patient.hasOwnProperty(toothNumber)) {
          const tooth = patientData.patient[toothNumber];
          const pdValue = pdValueMap.get(+toothNumber); // Get the corresponding pdValue

          if (pdValue) {
            // Directly handle the conversion and assignment
            pdValue.distalBuccal = this.convertAndCleanValue(
              tooth.Distal_Buccal
            );
            pdValue.buccal = this.convertAndCleanValue(tooth.Buccal);
            pdValue.mesialBuccal = this.convertAndCleanValue(
              tooth.Mesial_Buccal
            );
            pdValue.distalLingual = this.convertAndCleanValue(
              tooth.Distal_Lingual
            );
            pdValue.lingual = this.convertAndCleanValue(tooth.Lingual);
            pdValue.mesialLingual = this.convertAndCleanValue(
              tooth.Mesial_Lingual
            );
            pdValue.distalFacial = this.convertAndCleanValue(
              tooth.Distal_Facial
            );
            pdValue.facial = this.convertAndCleanValue(tooth.Facial);
            pdValue.mesialFacial = this.convertAndCleanValue(
              tooth.Mesial_Facial
            );
            pdValue.distalPalatial = this.convertAndCleanValue(
              tooth.Distal_Palatal
            );
            pdValue.palatial = this.convertAndCleanValue(tooth.Palatal);
            pdValue.mesialPalatial = this.convertAndCleanValue(
              tooth.Mesial_Palatal
            );
          }
        }
      }
    }
  }

  // Helper function to remove "mm" and convert to number
  private convertAndCleanValue(value: string | number): number {
    if (typeof value === 'string') {
      // Remove "mm" and convert to number, defaulting to 0 if invalid
      return parseFloat(value.replace('mm', '').trim()) || 0;
    }
    return value !== undefined && value !== null ? Number(value) : 0;
  }

  private updateToothData(toothNumber: number, data: string): void {
    const pd = this.pdValues.find((item) => item.toothNumber === toothNumber);
    const gm = this.gmValues.find((item) => item.toothNumber === toothNumber);
    const cal = this.calValues.find((item) => item.toothNumber === toothNumber);
    const bleeding = this.bleedingValues.find(
      (item) => item.toothNumber === toothNumber
    );
    const suppuration = this.suppurationValues.find(
      (item) => item.toothNumber === toothNumber
    );
    const mgj = this.mgjValues.find((item) => item.toothNumber === toothNumber);

    // if (pd) {
    //   const mobilityMatch = data.match(/mobility (\d+)/i);
    //   if (mobilityMatch) {
    //     pd.mobilityGrade = parseInt(mobilityMatch[1], 10);
    //   }

    //   const pdBuccalMatch = data.match(
    //     /(?:pd|pocket depth)\s+(?:buccal|buccle|buckle)\s+(\d+)(?:\s+(\d+)\s+(\d+))?/i
    //   );
    //   if (pdBuccalMatch) {
    //     if (pdBuccalMatch[2] && pdBuccalMatch[3]) {
    //       pd.pocketDepthBuccalLeft = parseInt(pdBuccalMatch[1], 10);
    //       pd.pocketDepthBuccalCenter = parseInt(pdBuccalMatch[2], 10);
    //       pd.pocketDepthBuccalRight = parseInt(pdBuccalMatch[3], 10);
    //     } else {
    //       pd.pocketDepthBuccalLeft = parseInt(pdBuccalMatch[1], 10);
    //       pd.pocketDepthBuccalCenter = parseInt(pdBuccalMatch[1], 10);
    //       pd.pocketDepthBuccalRight = parseInt(pdBuccalMatch[1], 10);
    //     }
    //   }

    //   const pdLingualMatch = data.match(
    //     /(?:pd|pocket depth)\s+(?:lingual|lingue)\s+(\d+)(?:\s+(\d+)\s+(\d+))?/i
    //   );
    //   if (pdLingualMatch) {
    //     if (pdLingualMatch[2] && pdLingualMatch[3]) {
    //       pd.pocketDepthLingualLeft = parseInt(pdLingualMatch[1], 10);
    //       pd.pocketDepthLingualCenter = parseInt(pdLingualMatch[2], 10);
    //       pd.pocketDepthLingualRight = parseInt(pdLingualMatch[3], 10);
    //     } else {
    //       pd.pocketDepthLingualLeft = parseInt(pdLingualMatch[1], 10);
    //       pd.pocketDepthLingualCenter = parseInt(pdLingualMatch[1], 10);
    //       pd.pocketDepthLingualRight = parseInt(pdLingualMatch[1], 10);
    //     }
    //   }
    // }

    if (gm) {
      const gmBuccalMatch = data.match(
        /gm\s+(?:buccal|buccle|buckle)\s+(\d+)(?:\s+(\d+)\s+(\d+))?/i
      );
      if (gmBuccalMatch) {
        if (gmBuccalMatch[2] && gmBuccalMatch[3]) {
          gm.gingivalMarginBuccalLeft = parseInt(gmBuccalMatch[1], 10);
          gm.gingivalMarginBuccalCenter = parseInt(gmBuccalMatch[2], 10);
          gm.gingivalMarginBuccalRight = parseInt(gmBuccalMatch[3], 10);
        } else {
          gm.gingivalMarginBuccalLeft = parseInt(gmBuccalMatch[1], 10);
          gm.gingivalMarginBuccalCenter = parseInt(gmBuccalMatch[1], 10);
          gm.gingivalMarginBuccalRight = parseInt(gmBuccalMatch[1], 10);
        }
      }

      const gmLingualMatch = data.match(
        /gm\s+(?:lingual|lingue)\s+(\d+)(?:\s+(\d+)\s+(\d+))?/i
      );
      if (gmLingualMatch) {
        if (gmLingualMatch[2] && gmLingualMatch[3]) {
          gm.gingivalMarginLingualLeft = parseInt(gmLingualMatch[1], 10);
          gm.gingivalMarginLingualCenter = parseInt(gmLingualMatch[2], 10);
          gm.gingivalMarginLingualRight = parseInt(gmLingualMatch[3], 10);
        } else {
          gm.gingivalMarginLingualLeft = parseInt(gmLingualMatch[1], 10);
          gm.gingivalMarginLingualCenter = parseInt(gmLingualMatch[1], 10);
          gm.gingivalMarginLingualRight = parseInt(gmLingualMatch[1], 10);
        }
      }
    }
    if (cal) {
      // Calculate CAL based on PD and GM
      // if (pd && gm) {
      //   cal.clinicalAttachmentLevelBuccalLeft =
      //     (pd.pocketDepthBuccalLeft || 0) + (gm.gingivalMarginBuccalLeft || 0);
      //   cal.clinicalAttachmentLevelBuccalCenter =
      //     (pd.pocketDepthBuccalCenter || 0) +
      //     (gm.gingivalMarginBuccalCenter || 0);
      //   cal.clinicalAttachmentLevelBuccalRight =
      //     (pd.pocketDepthBuccalRight || 0) +
      //     (gm.gingivalMarginBuccalRight || 0);
      //   cal.clinicalAttachmentLevelLingualLeft =
      //     (pd.pocketDepthLingualLeft || 0) +
      //     (gm.gingivalMarginLingualLeft || 0);
      //   cal.clinicalAttachmentLevelLingualCenter =
      //     (pd.pocketDepthLingualCenter || 0) +
      //     (gm.gingivalMarginLingualCenter || 0);
      //   cal.clinicalAttachmentLevelLingualRight =
      //     (pd.pocketDepthLingualRight || 0) +
      //     (gm.gingivalMarginLingualRight || 0);
      // }
    }

    // if (bleeding) {
    //   const bleedingMatch = data.match(/bleeding (buccal|lingual) (left|center|right)/i);
    //   if (bleedingMatch) {
    //     const surface = bleedingMatch[1].toLowerCase();
    //     const position = bleedingMatch[2].toLowerCase();
    //     const key = `isBleeding${surface.charAt(0).toUpperCase() + surface.slice(1)}${position.charAt(0).toUpperCase() + position.slice(1)}` as keyof Bleeding;
    //     bleeding[key] = true;
    //   }
    // }

    // if (suppuration) {
    //   const suppurationMatch = data.match(/suppuration (buccal|lingual) (left|center|right)/i);
    //   if (suppurationMatch) {
    //     const surface = suppurationMatch[1].toLowerCase();
    //     const position = suppurationMatch[2].toLowerCase();
    //     const key = `isSuppuration${surface.charAt(0).toUpperCase() + surface.slice(1)}${position.charAt(0).toUpperCase() + position.slice(1)}` as keyof Suppuration;
    //     suppuration[key] = true;
    //   }
    // }

    if (mgj) {
      const mgjBuccalMatch = data.match(
        /mgj\s+(?:buccal|buccle|buckle)\s+(\d+)(?:\s+(\d+)\s+(\d+))?/i
      );
      if (mgjBuccalMatch) {
        if (mgjBuccalMatch[2] && mgjBuccalMatch[3]) {
          mgj.mucogingivalJunctionBuccalLeft = parseInt(mgjBuccalMatch[1], 10);
          mgj.mucogingivalJunctionBuccalCenter = parseInt(
            mgjBuccalMatch[2],
            10
          );
          mgj.mucogingivalJunctionBuccalRight = parseInt(mgjBuccalMatch[3], 10);
        } else {
          mgj.mucogingivalJunctionBuccalLeft = parseInt(mgjBuccalMatch[1], 10);
          mgj.mucogingivalJunctionBuccalCenter = parseInt(
            mgjBuccalMatch[1],
            10
          );
          mgj.mucogingivalJunctionBuccalRight = parseInt(mgjBuccalMatch[1], 10);
        }
      }

      const mgjLingualMatch = data.match(
        /mgj\s+(?:lingual|lingue)\s+(\d+)(?:\s+(\d+)\s+(\d+))?/i
      );
      if (mgjLingualMatch) {
        if (mgjLingualMatch[2] && mgjLingualMatch[3]) {
          mgj.mucogingivalJunctionLingualLeft = parseInt(
            mgjLingualMatch[1],
            10
          );
          mgj.mucogingivalJunctionLingualCenter = parseInt(
            mgjLingualMatch[2],
            10
          );
          mgj.mucogingivalJunctionLingualRight = parseInt(
            mgjLingualMatch[3],
            10
          );
        } else {
          mgj.mucogingivalJunctionLingualLeft = parseInt(
            mgjLingualMatch[1],
            10
          );
          mgj.mucogingivalJunctionLingualCenter = parseInt(
            mgjLingualMatch[1],
            10
          );
          mgj.mucogingivalJunctionLingualRight = parseInt(
            mgjLingualMatch[1],
            10
          );
        }
      }
    }
  }

  getToothValue(toothNumber: number, property: keyof Tooth): number | boolean {
    const tooth = this.teeth.find((t) => t.toothNumber === toothNumber);

    // Check if the tooth exists and the property is defined
    if (tooth && tooth[property] !== undefined) {
      const value = tooth[property];

      // Ensure the value is either a number or boolean
      if (typeof value === 'number' || typeof value === 'boolean') {
        return value;
      }
    }

    // Return a default value if not found or type is incorrect
    return 0; // or false, depending on your logic
  }

  clearAll() {
    this.generatePdValues(); // Reset to default values
    this.generateGmValues();
    this.generateCalValues();
    this.generateBleedingValues();
    this.generateSuppurationValues();
    this.generateMgjValues();
  }
  toggleEdit() {
    this.isEditMode = !this.isEditMode;
  }
  newReport() {
    this.chartId = '';
    this.clearAll();
  }

  cancel() {
    this.route.navigate(['periodontal-chart-list'], {
      queryParams: { patientId: this.patientId },
    });
  }

  public audioUrl: string | null = null;

  stopRecording(): void {
    this.isRecording = false;
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    if (this.mediaRecorder && this.mediaRecorder.stream) {
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      console.log('Microphone access has been released.');
    }
  }

  async startListening(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
        },
      });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 1024; 
      source.connect(this.analyser);
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstart = () => {
        console.log('Recording started...');
        this.audioChunks = [];
      };

      this.mediaRecorder.onstop = async () => {
        if (this.audioChunks.length > 0) {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
          this.audioChunks = [];
          const isNoise = await this.isBackgroundNoise(audioBlob);
          if (isNoise && this.isRecording) {
            console.log('Background noise detected. Starting a new recording.');
            this.audioChunks = []; // Reset audio chunks
            if (this.mediaRecorder) {
              this.mediaRecorder.stop();
              this.mediaRecorder.start();
            }
          }
          if (!isNoise) 
          await this.sendAudioForTranscription(audioBlob);
        }
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.detectSilence();
      console.log('Listening started...');
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  private detectSilence(): void {
    if (!this.analyser || !this.dataArray) {
      console.error('Analyser or data array is not initialized.');
      return;
    }

    const checkSilence = () => {
      const dataArray = new Uint8Array(this.analyser?.frequencyBinCount || 0);
      this.analyser?.getByteFrequencyData(dataArray);
      const averageVolume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    //  console.log('avg', averageVolume);
      
      if (averageVolume < 40) {
        if (!this.isSilent) {
          this.isSilent = true;
          this.startSilenceTimer();
        }
      } else {
        if (this.isSilent) {
          this.isSilent = false;
          clearTimeout(this.silenceTimeout);
          console.log('User resumed speaking...');
        }
      }
      requestAnimationFrame(checkSilence);
    };

    checkSilence();
  }


  // Function to check if audio contains only background noise
  private async isBackgroundNoise(audioBlob: Blob): Promise<boolean> {
    const audioContext = new AudioContext();
    const reader = new FileReader();

    return new Promise<boolean>((resolve) => {
      reader.onload = async () => {
        const audioBuffer = await audioContext.decodeAudioData(
          reader.result as ArrayBuffer
        );
        const rawData = audioBuffer.getChannelData(0);
        const volume =
          rawData.reduce((sum, sample) => sum + Math.abs(sample), 0) /
          rawData.length;
        resolve(volume < 0.01); 
      };

      reader.readAsArrayBuffer(audioBlob);
    });
  }

  private startSilenceTimer(): void {

    if (this.silenceTimeout) {
      console.log('Clearing previous timeout...');
      clearTimeout(this.silenceTimeout);
    }
    // Set timeout to 1000ms (1 second) to detect silence for that period
    this.silenceTimeout = setTimeout(() => {
      console.log('Timeout triggered...');
      
      // Log the current state of isSilent and mediaRecorder
      console.log('isSilent:', this.isSilent);
      console.log('mediaRecorder state:', this.mediaRecorder?.state);
  
      if (this.isSilent && this.mediaRecorder?.state === 'recording') {
        console.log('Silence detected for 1000 milliseconds, stopping the recording...');
        this.mediaRecorder.stop();
      } else {
        console.log('Conditions not met for stopping the recording.');
      }
    }, 1000); // 1000ms timeout to detect silence for 1 second
  }

  private async sendAudioForTranscription(audioBlob: Blob): Promise<void> {
    const voiceRecognitionRequest: VoiceRecognitionRequestDto = {
      audioFile: new File([audioBlob], 'recorded-audio.mp3'),
      patientId: this.patientId,
      doctorId: this.doctorId,
      chartId: this.chartId,
      tenantId: this.tenantId,
    };

    try {
      console.log('Sending audio for transcription...');
      const transcriptionResult = await this.speechService
        .transcribeAudioFile(voiceRecognitionRequest)
        .toPromise();
      console.log('Transcription Result:', transcriptionResult);
      this.transcript = this.transcript.concat(transcriptionResult);
      this.processTranscript(transcriptionResult);
      if (this.isRecording && this.mediaRecorder) {
        this.mediaRecorder.start();
        console.log('Resumed listening after transcription.');
      }
    } catch (error) {
      console.error('Error sending audio for transcription:', error);
    }
  }
}
