export type EntryNode = string | {
  type?: string;
  name?: string;
  entry?: any;
  items?: any[];
  rows?: any[]; // table rows
  colLabels?: string[];
  colStyles?: string[];
  [k: string]: any;
};

export type Background = {
  index?: string;
  name: string;
  source?: string;
  entries?: EntryNode[];
  entry?: EntryNode[];
  skillProficiencies?: any;
  languageProficiencies?: any;
  url?: string;
  [k: string]: any;
};

export type Subclass = {
  index?: string;
  name: string;
  entries?: EntryNode[];
  features?: any[];
  desc?: string[];
  [k:string]: any;
};

export type ClassType = {
  index?: string;
  name: string;
  hd?: string|number;
  hit_die?: number;
  subclasses?: Subclass[];
  classFeatures?: any[];
  entries?: EntryNode[];
  desc?: string[];
  url?: string;
  [k:string]: any;
};

export type Subrace = {
  index?: string;
  name: string;
  entries?: EntryNode[];
  desc?: string[];
  ability_bonuses?: any;
  [k:string]: any;
};

export type RaceType = {
  index?: string;
  name: string;
  size?: string;
  speed?: number | { value?: number; [k:string]: any };
  ability_bonuses?: any;
  ability_bonus_options?: any;
  subraces?: Subrace[];
  subrace?: Subrace[];
  entries?: EntryNode[];
  desc?: string[];
  url?: string;
  [k:string]: any;
};

export type SpellType = {
  index?: string;
  name: string;
  level?: number;
  school?: { index?: string; name: string; } | string;
  ritual?: boolean;
  casting_time?: Array<{ action: string; value: number; type?: string }> | string;
  range?: { value?: number; unit?: string; } | { type: string; value?: string; } | string;
  components?: string[];
  material?: string;
  duration?: Array<{ type: string; duration?: any; }> | string;
  entries?: EntryNode[];
  desc?: string[];
  url?: string;
  [k:string]: any;
};

export type Book = {
  name: string;
  acronym?: string;
  backgrounds?: Background[];
  classes?: ClassType[];
  races?: RaceType[];
  spells?: SpellType[];
  feats?: any[];
};
