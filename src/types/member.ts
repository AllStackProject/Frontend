export interface OrgMember {
  groups: any;
  id: number;
  user_name: string;
  nickname: string;
  is_super_admin: boolean;
  is_admin: boolean;
  member_groups: {
    id: number;
    name: string;
  }[];
}

export interface GroupItem {
  id: number;
  name: string;
}

export interface JoinRequestUser {
  id: number;
  user_name: string;
  nickname: string;
  requested_at: string;
}

export interface JoinRequestGroup {
  id: number;
  name: string;
}