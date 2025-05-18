// user
export enum UserRole {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

// event
export enum EventCategory {
  LOGIN = 'LOGIN',
  // FRIEND_INVITE = 'FRIEND_INVITE',
  // PURCHASE = 'PURCHASE',
}

export enum EventStatusType {
  ON = 'ON',
  OFF = 'OFF',
}

export enum EventTriggerType {
  SINGLE = 'SINGLE',
  STREAK = 'STREAK',
  // COUNT = 'COUNT',
}
