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
  name: string;
  source?: string;
  entries?: EntryNode[];
  entry?: EntryNode[];
  skillProficiencies?: any;
  languageProficiencies?: any;
  [k: string]: any;
};

export type Subclass = {
  name: string;
  entries?: EntryNode[];
  features?: any[];
  [k:string]: any;
};

export type ClassType = {
  name: string;
  hd?: string|number;
  hit_die?: number;
  subclasses?: Subclass[];
  classFeatures?: any[];
  entries?: EntryNode[];
  [k:string]: any;
};

export type Subrace = {
  name: string;
  entries?: EntryNode[];
  [k:string]: any;
};

export type RaceType = {
  name: string;
  size?: string;
  speed?: number | { walk?: number; [k:string]: any };
  ability_bonuses?: any;
  subraces?: Subrace[];
  entries?: EntryNode[];
  [k:string]: any;
};

export type SpellType = {
  name: string;
  level?: number;
  school?: string;
  ritual?: boolean;
  casting_time?: string;
  range?: string;
  components?: string[];
  material?: string;
  duration?: string;
  entries?: EntryNode[];
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
