export const WS_EVENTS = {
  CONNECTION_SUCCESS: "connection:success",

  JOIN_PROJECT: "project:join",
  LEAVE_PROJECT: "project:leave",
  
  PROJECT_JOINED: "project:joined",
  PROJECT_LEFT: "project:left",

  TASK_CREATED: "task:created",
  TASK_UPDATED: "task:updated",
  TASK_DELETED: "task:deleted",

  PROJECT_CREATED: "project:created",
  PROJECT_UPDATED: "project:updated",

  TEAM_MEMBER_ADDED: "team:member-added",
  TEAM_MEMBER_REMOVED: "team:member-removed",

  TEST_BROADCAST: "test:broadcast",


} as const;