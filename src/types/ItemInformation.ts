export interface RootInfo {
  apiVersion: string;
  data: Data;
  error: any;
}

export interface Data {
  id: string;
  tradable: boolean;
  tags: string[];
  urlName: string;
  gameRef: string;
  setRoot: boolean;
  setParts: string[];
  quantityInSet: number;
  ducats: number;
  mastery: number;
  tradingTax: number;
  i18n: I18n;
}

export interface I18n {
  en: En;
}

export interface En {
  name: string;
  description: string;
  wikiLink: string;
  icon: string;
  thumb: string;
  subIcon: string;
}
