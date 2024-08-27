import { AnimalWelfare, DisasterRelief, Education, Environment, People } from '@ui/icons/CausesIcons';

export type Category = {
  id: string;
  name: string;
  label: string;
  image: string;
  coloredImage: string;
  Icon: JSX.Element;
  color: string;
};

const causes: Record<string, Category> = {
  '58aaaad0-28f5-4515-a1dc-e5578e00b046': {
    id: '58aaaad0-28f5-4515-a1dc-e5578e00b046',
    name: 'ANIMAL_WELFARE',
    label: 'Animal welfare',
    image: 'images/causes/animal_welfare.svg',
    coloredImage: 'images/causes/colored/animal_welfare.svg',
    Icon: AnimalWelfare,
    color: '#7A30DA',
  },
  '9604e711-274b-451a-b4c7-036fab8578ed': {
    id: '9604e711-274b-451a-b4c7-036fab8578ed',
    name: 'DISASTER_RELIEF',
    label: 'Disaster relief',
    image: 'images/causes/disaster_relief.svg',
    coloredImage: 'images/causes/colored/disaster_relief.svg',
    Icon: DisasterRelief,
    color: '#FC3115',
  },
  '99fef02e-be7c-41c0-8958-c56f4d20cfae': {
    id: '99fef02e-be7c-41c0-8958-c56f4d20cfae',
    name: 'EDUCATION',

    label: 'Education',
    image: 'images/causes/education.svg',
    coloredImage: 'images/causes/colored/education.svg',
    Icon: Education,
    color: '#FFC121',
  },
  '5fc699fc-6057-4dc1-8983-8e7fd4cad03d': {
    id: '5fc699fc-6057-4dc1-8983-8e7fd4cad03d',
    name: 'ENVIRONMENT',

    label: 'Environment',
    image: 'images/causes/environment.svg',
    coloredImage: 'images/causes/colored/environment.svg',
    Icon: Environment,
    color: '#039F00',
  },
  '75b310fb-47f9-48bf-9b5d-1d34286ac0cb': {
    id: '75b310fb-47f9-48bf-9b5d-1d34286ac0cb',
    name: 'PEOPLE',
    label: 'People',
    image: 'images/causes/people.svg',
    coloredImage: 'images/causes/colored/people.svg',
    Icon: People,
    color: '#2F52A8',
  },
};

const causesByName: Record<string, Category> = Object.values(causes).reduce((acc, cause) => {
  acc[cause.name] = cause;
  return acc;
}, {} as Record<string, Category>);

export default causes;
export { causesByName };
