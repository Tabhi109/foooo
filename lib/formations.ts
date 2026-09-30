export type PositionCategory = 'GK' | 'DEF' | 'MID' | 'FWD';

export type FormationSlot = {
  id: string;
  label: string;
  position: PositionCategory;
  x: number;
  y: number;
};

export const FORMATIONS = {
  '4-3-3': [
    { id: 'gk', label: 'GK', position: 'GK', x: 50, y: 92 },
    { id: 'lb', label: 'LB', position: 'DEF', x: 22, y: 72 },
    { id: 'cb-1', label: 'CB', position: 'DEF', x: 38, y: 68 },
    { id: 'cb-2', label: 'CB', position: 'DEF', x: 62, y: 68 },
    { id: 'rb', label: 'RB', position: 'DEF', x: 78, y: 72 },
    { id: 'cm-1', label: 'CM', position: 'MID', x: 34, y: 48 },
    { id: 'cm-2', label: 'CM', position: 'MID', x: 50, y: 42 },
    { id: 'cm-3', label: 'CM', position: 'MID', x: 66, y: 48 },
    { id: 'lw', label: 'LW', position: 'FWD', x: 22, y: 24 },
    { id: 'st', label: 'ST', position: 'FWD', x: 50, y: 18 },
    { id: 'rw', label: 'RW', position: 'FWD', x: 78, y: 24 },
  ],
  '4-4-2': [
    { id: 'gk', label: 'GK', position: 'GK', x: 50, y: 92 },
    { id: 'lb', label: 'LB', position: 'DEF', x: 18, y: 72 },
    { id: 'cb-1', label: 'CB', position: 'DEF', x: 38, y: 68 },
    { id: 'cb-2', label: 'CB', position: 'DEF', x: 62, y: 68 },
    { id: 'rb', label: 'RB', position: 'DEF', x: 82, y: 72 },
    { id: 'lm', label: 'LM', position: 'MID', x: 18, y: 46 },
    { id: 'cm-1', label: 'CM', position: 'MID', x: 38, y: 42 },
    { id: 'cm-2', label: 'CM', position: 'MID', x: 62, y: 42 },
    { id: 'rm', label: 'RM', position: 'MID', x: 82, y: 46 },
    { id: 'st-1', label: 'ST', position: 'FWD', x: 38, y: 18 },
    { id: 'st-2', label: 'ST', position: 'FWD', x: 62, y: 18 },
  ],
  '3-5-2': [
    { id: 'gk', label: 'GK', position: 'GK', x: 50, y: 92 },
    { id: 'cb-1', label: 'CB', position: 'DEF', x: 34, y: 70 },
    { id: 'cb-2', label: 'CB', position: 'DEF', x: 50, y: 66 },
    { id: 'cb-3', label: 'CB', position: 'DEF', x: 66, y: 70 },
    { id: 'lwb', label: 'LWB', position: 'DEF', x: 18, y: 50 },
    { id: 'cm-1', label: 'CM', position: 'MID', x: 38, y: 48 },
    { id: 'cm-2', label: 'CM', position: 'MID', x: 50, y: 38 },
    { id: 'cm-3', label: 'CM', position: 'MID', x: 62, y: 48 },
    { id: 'rwb', label: 'RWB', position: 'DEF', x: 82, y: 50 },
    { id: 'st-1', label: 'ST', position: 'FWD', x: 38, y: 18 },
    { id: 'st-2', label: 'ST', position: 'FWD', x: 62, y: 18 },
  ],
  '4-2-3-1': [
    { id: 'gk', label: 'GK', position: 'GK', x: 50, y: 92 },
    { id: 'lb', label: 'LB', position: 'DEF', x: 18, y: 72 },
    { id: 'cb-1', label: 'CB', position: 'DEF', x: 38, y: 68 },
    { id: 'cb-2', label: 'CB', position: 'DEF', x: 62, y: 68 },
    { id: 'rb', label: 'RB', position: 'DEF', x: 82, y: 72 },
    { id: 'dm-1', label: 'DM', position: 'MID', x: 38, y: 48 },
    { id: 'dm-2', label: 'DM', position: 'MID', x: 62, y: 48 },
    { id: 'am', label: 'AM', position: 'MID', x: 50, y: 32 },
    { id: 'lw', label: 'LW', position: 'FWD', x: 22, y: 22 },
    { id: 'rw', label: 'RW', position: 'FWD', x: 78, y: 22 },
    { id: 'st', label: 'ST', position: 'FWD', x: 50, y: 16 },
  ],
} as const;

export type FormationName = keyof typeof FORMATIONS;

export const formationOrder: FormationName[] = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'];

export function getFormationSlots(formation: FormationName): FormationSlot[] {
  return FORMATIONS[formation].map((slot) => ({ ...slot }));
}
