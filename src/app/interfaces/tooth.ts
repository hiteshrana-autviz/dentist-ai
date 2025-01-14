// src/app/models/tooth.model.ts
export interface Tooth {
  // tenantId: string; // Identifier for multi-tenancy
  // chartId: string; // Reference to the periodontal chart
  toothNumber: number; // E.g., 19, 32
   // Properties for teeth 1-5, 12-21, 28-32
   distalBuccal?: number | null | undefined;
   buccal?: number | null | undefined;
   mesialBuccal?: number | null | undefined;
   distalLingual?: number | null | undefined;
   lingual?: number | null | undefined;
   mesialLingual?: number | null | undefined;
 
   // Properties for teeth 6-11, 22-27
   distalFacial?: number | null | undefined;
   facial?: number | null | undefined;
   mesialFacial?: number | null | undefined;
   distalPalatial?: number | null | undefined;
   palatial?: number | null | undefined;
   mesialPalatial?: number | null | undefined;

   gingivalMarginBuccalLeft?: number | null;
   gingivalMarginBuccalCenter?: number | null;
   gingivalMarginBuccalRight?: number | null;
   gingivalMarginLingualLeft?: number | null;
   gingivalMarginLingualCenter?: number | null;
   gingivalMarginLingualRight?: number | null; 

   clinicalAttachmentLevelBuccalLeft?: number | null;
  clinicalAttachmentLevelBuccalCenter?: number | null;
  clinicalAttachmentLevelBuccalRight?: number | null;
  clinicalAttachmentLevelLingualLeft?: number | null;
  clinicalAttachmentLevelLingualCenter?: number | null;
  clinicalAttachmentLevelLingualRight?: number | null;

  isBleedingBuccalLeft: boolean;
  isBleedingBuccalCenter: boolean;
  isBleedingBuccalRight: boolean;
  isBleedingLingualLeft: boolean;
  isBleedingLingualCenter: boolean;
  isBleedingLingualRight: boolean;
  isSuppurationBuccalLeft: boolean;
  isSuppurationBuccalCenter: boolean;
  isSuppurationBuccalRight: boolean;
  isSuppurationLingualLeft: boolean;
  isSuppurationLingualCenter: boolean;
  isSuppurationLingualRight: boolean;

  mucogingivalJunctionBuccalLeft?: number | null;
  mucogingivalJunctionBuccalCenter?: number | null;
  mucogingivalJunctionBuccalRight?: number | null;
  mucogingivalJunctionLingualLeft?: number | null;
  mucogingivalJunctionLingualCenter?: number | null;
  mucogingivalJunctionLingualRight?: number | null;
  mobilityGrade?: number; // 1, 2, 3
  furcationGrade?: number;
  isMissingTooth: boolean;
  hasImplant: boolean;
  notes?: string;
}
// Define the interface for each tooth's pocket depth values
export interface PocketDepth {
  toothNumber: number;

   // Properties for teeth 1-5, 12-21, 28-32
   distalBuccal?: number | null | undefined;
   buccal?: number | null | undefined;
   mesialBuccal?: number | null | undefined;
   distalLingual?: number | null | undefined;
   lingual?: number | null | undefined;
   mesialLingual?: number | null | undefined;
 
   // Properties for teeth 6-11, 22-27
   distalFacial?: number | null | undefined;
   facial?: number | null | undefined;
   mesialFacial?: number | null | undefined;
   distalPalatial?: number | null | undefined;
   palatial?: number | null | undefined;
   mesialPalatial?: number | null | undefined;
  // pocketDepthBuccalLeft: number | undefined;
  // pocketDepthBuccalCenter: number | undefined;
  // pocketDepthBuccalRight: number | undefined;
  // pocketDepthLingualLeft: number | undefined;
  // pocketDepthLingualCenter: number | undefined;
  // pocketDepthLingualRight: number | undefined;
  mobilityGrade?: number;
}

export interface GingivalMargin {
  toothNumber: number;
  gingivalMarginBuccalLeft?: number | null;
  gingivalMarginBuccalCenter?: number | null;
  gingivalMarginBuccalRight?: number | null;
  gingivalMarginLingualLeft?: number | null;
  gingivalMarginLingualCenter?: number | null;
  gingivalMarginLingualRight?: number | null;
}

export interface clinicalAttachmentLevel {
  toothNumber: number;
  clinicalAttachmentLevelBuccalLeft?: number | null;
  clinicalAttachmentLevelBuccalCenter?: number | null;
  clinicalAttachmentLevelBuccalRight?: number | null;
  clinicalAttachmentLevelLingualLeft?: number | null;
  clinicalAttachmentLevelLingualCenter?: number | null;
  clinicalAttachmentLevelLingualRight?: number | null;
}

export interface Bleeding {
  toothNumber: number;
  isBleedingBuccalLeft: boolean;
  isBleedingBuccalCenter: boolean;
  isBleedingBuccalRight: boolean;
  isBleedingLingualLeft: boolean;
  isBleedingLingualCenter: boolean;
  isBleedingLingualRight: boolean;
}

export interface Suppuration {
  toothNumber: number;
  isSuppurationBuccalLeft: boolean;
  isSuppurationBuccalCenter: boolean;
  isSuppurationBuccalRight: boolean;
  isSuppurationLingualLeft: boolean;
  isSuppurationLingualCenter: boolean;
  isSuppurationLingualRight: boolean;
}

export interface MucogingivalJunction {
  toothNumber: number;
  mucogingivalJunctionBuccalLeft?: number | null;
  mucogingivalJunctionBuccalCenter?: number | null;
  mucogingivalJunctionBuccalRight?: number | null;
  mucogingivalJunctionLingualLeft?: number | null;
  mucogingivalJunctionLingualCenter?: number | null;
  mucogingivalJunctionLingualRight?: number | null;
}


export interface AddOrUpdateTeethDto {
  patientId: string;
  tenantId: string;
  doctorId: string;
  chartId?: string | null;
  teeth: Tooth[];
}