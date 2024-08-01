export interface RootOrders {
  apiVersion: string;
  data: Data;
  error: any;
}

export interface Data {
  buy: Buy[];
  sell: Sell[];
}

export interface Buy {
  id: string;
  type: string;
  platinum: number;
  quantity: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  crosstrade: boolean;
  user: User;
}

export interface User {
  id: string;
  ingameName: string;
  reputation: number;
  platform: string;
  locale: string;
  status: string;
  activity: Activity;
  lastSeen: string;
  avatar?: string;
}

export interface Activity {
  type: string;
  details: string;
  startedAt: string;
}

export interface Sell {
  id: string;
  type: string;
  platinum: number;
  quantity: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  crosstrade: boolean;
  user: User2;
}

export interface User2 {
  id: string;
  ingameName: string;
  reputation: number;
  platform: string;
  locale: string;
  status: string;
  activity: Activity2;
  lastSeen: string;
  avatar?: string;
}

export interface Activity2 {
  type: string;
  details: string;
  startedAt: string;
}
