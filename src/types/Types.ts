type UsersParams = {
  userIdentifier: string;
}

type TasksParams = {
  userIdentifier: string;
  taskIdentifier: string;
}

type UsersBody = {
  userIdentifier: string;
  userSecret: string;
  userName: string;
}

type TasksBody = {
  taskIdentifier: string;
  taskAuthor: string;
  taskTitle: string;
  taskContent: string;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string | null;
}

export type Types = {
  UserParams: UsersParams;
  TaskParams: TasksParams;
  UserBody: UsersBody;
  TaskBody: TasksBody;
}