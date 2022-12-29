type Params = {
  userIdentifier: string;
  secretKey: string;
}

type Body = {
  userIdentifier: string;
  userSecret: string;
  userName: string;
}

export type Types = {
  Params: Params;
  Body: Body;
}