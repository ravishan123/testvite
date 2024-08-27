import { Skill } from './languages.type';

export interface CustomSkills {
  skill: string;
}

export interface DefaultSkills {
  id: string;
  name: string;
}

export interface Skills {
  defaultSkills: DefaultSkills[];
  customSkills: CustomSkills[];
}

export type SkillsResponse = {
  data: Skill[];
};
