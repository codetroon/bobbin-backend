import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

type StringValue =
  | `${number}ms`
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`
  | `${number}w`
  | `${number}y`;

const createToken = (
  payload: Record<string, unknown>,
  secret: string,
  expiresIn: string | number,
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as number | StringValue,
  };

  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
