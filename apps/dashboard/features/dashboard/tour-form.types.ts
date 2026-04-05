import type {TourLifecycleStatus} from '@/features/dashboard/admin-data';
import type {DashboardTourInput} from '@/features/dashboard/tour-form-data';

export type SubmitState =
  | {
      type: 'success' | 'error';
      message: string;
    }
  | null;

export type TourDashboardFormProps = {
  initialData?: DashboardTourInput;
  mode?: 'create' | 'edit';
  originalSlug?: string;
};

export type DashboardFormAction =
  | {type: 'reset'; payload: DashboardTourInput}
  | {type: 'setField'; key: keyof DashboardTourInput; value: DashboardTourInput[keyof DashboardTourInput]}
  | {type: 'setTitle'; title: string; slugEdited: boolean}
  | {type: 'toggleCategory'; category: string}
  | {type: 'updateParticipantRule'; key: keyof DashboardTourInput['participantRules']; value: string}
  | {type: 'updateRegion'; regionKey: string; patch: Partial<DashboardTourInput['regions'][string]>}
  | {type: 'toggleRegionDay'; regionKey: string; dayKey: string}
  | {type: 'addListItem'; field: 'keywords' | 'thingsToBring' | 'importantNotes'; value: string}
  | {type: 'removeListItem'; field: 'keywords' | 'thingsToBring' | 'importantNotes'; index: number};

export type FormActionPayload = {
  publishState: TourLifecycleStatus;
};
