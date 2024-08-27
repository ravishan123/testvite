export interface Language {
  language?: string;
  id: string;
  abilities?: string[] | object;
  isManuallyAdded?: boolean;
  name?: string;
  default_language?: boolean;
  fluency?: string[];
}

export type Languages = {
  languageId: string;
  user_read: boolean;
  user_speak: boolean;
  user_type: boolean;
  user_write: boolean;
};

export interface SkillsProps {
  handleNextStep: (isUpdated?: boolean) => void;
  handleBackStep: () => void;
  handleComplete: () => void;
}

export interface SkillResponse {
  data: { data: Skill[] };
  message?: string;
}

export interface LanguageOption {
  label: string;
  value: string;
}

export interface SkillSelectionProps {
  skill: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  errors: boolean;
}

export interface Skill {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  default_skill?: boolean;
}

export type SkillWithoutId = Omit<Skill, 'id'>;

export type Abilities = {
  abilities: {
    read: boolean;
    write: boolean;
    speak: boolean;
  };
};
export type LanguageWithAbilities = Language & Abilities;

export interface SkillsApiResponse {
  data: { data: Skill[] };
  message?: string;
}

export interface LanguageResponse {
  data: { data: Language[] };
  message?: string;
}

export interface LanguagePayload {
  language_id: string;
  abilities: {
    read: boolean;
    write: boolean;
    speak: boolean;
  };
}
