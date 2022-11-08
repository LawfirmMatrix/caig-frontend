export interface User {
  name: string;
  email: string;
  username: string;
  avatar?: string;
  roleId: Role;
  roleName: string;
  id: number;
  settlements?: UserSettlement[];
}

export interface UserSettlement {
  id: number;
  code: string;
  title: string;
  isOpen: boolean;
  adminEmail: string;
  adminCc: string;
}

export interface Session {
  mustChangePassword?: boolean;
  user: User;
  settlements: UserSettlement[];
  portal: Portal;
}

export interface UserRole {
  id: number;
  name: string;
  icon?: string;
}

export enum Role {
  User = 1,
  Administrator,
  Superadmin,
  INACTIVE,
  Client
}

export enum Portal {
  CallCenter = 'Call Center',
  CAIG = 'CAIG',
  Survey = 'Survey',
}
