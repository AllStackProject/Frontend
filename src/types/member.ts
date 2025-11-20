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

export interface OrgMyActivityResponse {
  org_name: string;
  org_code: string;
  nickname: string;
  is_admin: boolean;
  joined_at: string;
  member_groups: string[];
}

export interface OrgMyActivityGroupResponse {
  id: number;
  name: string;
  categories: string[];
  title: string
}

export interface GroupCategory {
  id: number;
  title: string;
}

export interface MemberGroup {
  id: number;
  name: string;
  categories: GroupCategory[];
}

export interface OrgMyActivityGroupResponse {
  member_groups: MemberGroup[];
}