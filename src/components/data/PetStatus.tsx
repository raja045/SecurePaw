export interface PetStatus {
  name: string;
}

// prettier-ignore
export default [
  {
    name: 'Draft'
  },
  {
    name: 'Published'
  },
  {
    name: 'Hold'
  },
  {
    name: 'Adopted'
  }
] as PetStatus[];
