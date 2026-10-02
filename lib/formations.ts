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
    { id: 'lb', label: 'LB', position: 'DEF', x: 20, y: 72 },
    { id: 'cb-1', label: 'CB', position: 'DEF', x: 38, y: 68 },
    { id: 'cb-2', label: 'CB', position: 'DEF', x: 62, y: 68 },
    { id: 'rb', label: 'RB', position: 'DEF', x: 80, y: 72 },
    { id: 'cm-1', label: 'CM', position: 'MID', x: 32, y: 46 },
    { id: 'cm-2', label: 'CM', position: 'MID', x: 50, y: 40 },
    { id: 'cm-3', label: 'CM', position: 'MID', x: 68, y: 46 },
    { id: 'lw', label: 'LW', position: 'FWD', x: 22, y: 22 },
    { id: 'st', label: 'ST', position: 'FWD', x: 50, y: 16 },
    { id: 'rw', label: 'RW', position: 'FWD', x: 78, y: 22 },
  ],
  '4-2-3-1': [
    { id: 'gk', label: 'GK', position: 'GK', x: 50, y: 92 },
    { id: 'lb', label: 'LB', position: 'DEF', x: 18, y: 72 },
    { id: 'cb-1', label: 'CB', position: 'DEF', x: 38, y: 68 },
    { id: 'cb-2', label: 'CB', position: 'DEF', x: 62, y: 68 },
    { id: 'rb', label: 'RB', position: 'DEF', x: 82, y: 72 },
    { id: 'dm-1', label: 'DM', position: 'MID', x: 38, y: 50 },
    { id: 'dm-2', label: 'DM', position: 'MID', x: 62, y: 50 },
    { id: 'am', label: 'AM', position: 'MID', x: 50, y: 34 },
    { id: 'lw', label: 'LW', position: 'FWD', x: 22, y: 24 },
    { id: 'rw', label: 'RW', position: 'FWD', x: 78, y: 24 },
    { id: 'st', label: 'ST', position: 'FWD', x: 50, y: 16 },
  ],
  '4-4-2': [
    { id: 'gk', label: 'GK', position: 'GK', x: 50, y: 92 },
    { id: 'lb', label: 'LB', position: 'DEF', x: 18, y: 72 },
    { id: 'cb-1', label: 'CB', position: 'DEF', x: 38, y: 68 },
    { id: 'cb-2', label: 'CB', position: 'DEF', x: 62, y: 68 },
    { id: 'rb', label: 'RB', position: 'DEF', x: 82, y: 72 },
    { id: 'lm', label: 'LM', position: 'MID', x: 18, y: 46 },
    { id: 'cm-1', label: 'CM', position: 'MID', x: 38, y: 44 },
    { id: 'cm-2', label: 'CM', position: 'MID', x: 62, y: 44 },
    { id: 'rm', label: 'RM', position: 'MID', x: 82, y: 46 },
    { id: 'st-1', label: 'ST', position: 'FWD', x: 38, y: 18 },
    { id: 'st-2', label: 'ST', position: 'FWD', x: 62, y: 18 },
  ],
  '3-5-2': [
    { id: 'gk', label: 'GK', position: 'GK', x: 50, y: 92 },
    { id: 'cb-1', label: 'CB', position: 'DEF', x: 30, y: 70 },
    { id: 'cb-2', label: 'CB', position: 'DEF', x: 50, y: 66 },
    { id: 'cb-3', label: 'CB', position: 'DEF', x: 70, y: 70 },
    { id: 'lwb', label: 'LWB', position: 'DEF', x: 16, y: 48 },
    { id: 'cm-1', label: 'CM', position: 'MID', x: 36, y: 46 },
    { id: 'cm-2', label: 'CM', position: 'MID', x: 50, y: 36 },
    { id: 'cm-3', label: 'CM', position: 'MID', x: 64, y: 46 },
    { id: 'rwb', label: 'RWB', position: 'DEF', x: 84, y: 48 },
    { id: 'st-1', label: 'ST', position: 'FWD', x: 38, y: 18 },
    { id: 'st-2', label: 'ST', position: 'FWD', x: 62, y: 18 },
  ],
  '5-3-2': [
    { id: 'gk', label: 'GK', position: 'GK', x: 50, y: 92 },
    { id: 'lwb', label: 'LWB', position: 'DEF', x: 16, y: 64 },
    { id: 'cb-1', label: 'CB', position: 'DEF', x: 32, y: 70 },
    { id: 'cb-2', label: 'CB', position: 'DEF', x: 50, y: 68 },
    { id: 'cb-3', label: 'CB', position: 'DEF', x: 68, y: 70 },
    { id: 'rwb', label: 'RWB', position: 'DEF', x: 84, y: 64 },
    { id: 'cm-1', label: 'CM', position: 'MID', x: 32, y: 44 },
    { id: 'cm-2', label: 'CM', position: 'MID', x: 50, y: 40 },
    { id: 'cm-3', label: 'CM', position: 'MID', x: 68, y: 44 },
    { id: 'st-1', label: 'ST', position: 'FWD', x: 38, y: 18 },
    { id: 'st-2', label: 'ST', position: 'FWD', x: 62, y: 18 },
  ],
  '4-1-2-1-2': [
    { id: 'gk', label: 'GK', position: 'GK', x: 50, y: 92 },
    { id: 'lb', label: 'LB', position: 'DEF', x: 18, y: 72 },
    { id: 'cb-1', label: 'CB', position: 'DEF', x: 38, y: 68 },
    { id: 'cb-2', label: 'CB', position: 'DEF', x: 62, y: 68 },
    { id: 'rb', label: 'RB', position: 'DEF', x: 82, y: 72 },
    { id: 'dm', label: 'DM', position: 'MID', x: 50, y: 54 },
    { id: 'cm-1', label: 'CM', position: 'MID', x: 30, y: 42 },
    { id: 'cm-2', label: 'CM', position: 'MID', x: 70, y: 42 },
    { id: 'cam', label: 'CAM', position: 'MID', x: 50, y: 30 },
    { id: 'st-1', label: 'ST', position: 'FWD', x: 38, y: 16 },
    { id: 'st-2', label: 'ST', position: 'FWD', x: 62, y: 16 },
  ],
} as const;

export type FormationName = keyof typeof FORMATIONS;

export const formationOrder: FormationName[] = [
  '4-3-3',
  '4-2-3-1',
  '4-4-2',
  '3-5-2',
  '5-3-2',
  '4-1-2-1-2',
];

export const FORMATION_LINKS: Record<FormationName, Array<[string, string]>> = {
  '4-3-3': [
    ['gk', 'cb-1'], ['gk', 'cb-2'],
    ['lb', 'cb-1'], ['cb-1', 'cb-2'], ['cb-2', 'rb'],
    ['lb', 'cm-1'], ['cb-1', 'cm-1'], ['cb-2', 'cm-3'], ['rb', 'cm-3'],
    ['cm-1', 'cm-2'], ['cm-2', 'cm-3'],
    ['cm-1', 'lw'], ['cm-2', 'st'], ['cm-3', 'rw'],
    ['lw', 'st'], ['st', 'rw'],
  ],
  '4-2-3-1': [
    ['gk', 'cb-1'], ['gk', 'cb-2'],
    ['lb', 'cb-1'], ['cb-1', 'cb-2'], ['cb-2', 'rb'],
    ['lb', 'dm-1'], ['cb-1', 'dm-1'], ['cb-2', 'dm-2'], ['rb', 'dm-2'],
    ['dm-1', 'dm-2'],
    ['dm-1', 'am'], ['dm-2', 'am'], ['dm-1', 'lw'], ['dm-2', 'rw'],
    ['lw', 'am'], ['am', 'rw'],
    ['lw', 'st'], ['am', 'st'], ['rw', 'st'],
  ],
  '4-4-2': [
    ['gk', 'cb-1'], ['gk', 'cb-2'],
    ['lb', 'cb-1'], ['cb-1', 'cb-2'], ['cb-2', 'rb'],
    ['lb', 'lm'], ['cb-1', 'cm-1'], ['cb-2', 'cm-2'], ['rb', 'rm'],
    ['lm', 'cm-1'], ['cm-1', 'cm-2'], ['cm-2', 'rm'],
    ['lm', 'st-1'], ['cm-1', 'st-1'], ['cm-2', 'st-2'], ['rm', 'st-2'],
    ['st-1', 'st-2'],
  ],
  '3-5-2': [
    ['gk', 'cb-1'], ['gk', 'cb-2'], ['gk', 'cb-3'],
    ['cb-1', 'cb-2'], ['cb-2', 'cb-3'],
    ['cb-1', 'lwb'], ['cb-1', 'cm-1'], ['cb-2', 'cm-2'], ['cb-3', 'cm-3'], ['cb-3', 'rwb'],
    ['lwb', 'cm-1'], ['cm-1', 'cm-2'], ['cm-2', 'cm-3'], ['cm-3', 'rwb'],
    ['cm-1', 'st-1'], ['cm-2', 'st-1'], ['cm-2', 'st-2'], ['cm-3', 'st-2'],
    ['st-1', 'st-2'],
  ],
  '5-3-2': [
    ['gk', 'cb-1'], ['gk', 'cb-2'], ['gk', 'cb-3'],
    ['lwb', 'cb-1'], ['cb-1', 'cb-2'], ['cb-2', 'cb-3'], ['cb-3', 'rwb'],
    ['lwb', 'cm-1'], ['cb-1', 'cm-1'], ['cb-2', 'cm-2'], ['cb-3', 'cm-3'], ['rwb', 'cm-3'],
    ['cm-1', 'cm-2'], ['cm-2', 'cm-3'],
    ['cm-1', 'st-1'], ['cm-2', 'st-1'], ['cm-2', 'st-2'], ['cm-3', 'st-2'],
    ['st-1', 'st-2'],
  ],
  '4-1-2-1-2': [
    ['gk', 'cb-1'], ['gk', 'cb-2'],
    ['lb', 'cb-1'], ['cb-1', 'cb-2'], ['cb-2', 'rb'],
    ['lb', 'dm'], ['cb-1', 'dm'], ['cb-2', 'dm'], ['rb', 'dm'],
    ['dm', 'cm-1'], ['dm', 'cm-2'],
    ['cm-1', 'cam'], ['cm-2', 'cam'],
    ['cm-1', 'st-1'], ['cm-2', 'st-2'],
    ['cam', 'st-1'], ['cam', 'st-2'],
    ['st-1', 'st-2'],
  ],
};

export function getFormationSlots(formation: FormationName): FormationSlot[] {
  return FORMATIONS[formation].map((slot) => ({ ...slot }));
}
