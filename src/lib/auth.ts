import jwt from 'jsonwebtoken';

export const generateJwt = (id: string, secret: string): string => {
  return jwt.sign(id, secret);
};

export const verifyJwt = (jwtString: string, secret: string) => {
  try {
    jwt.verify(jwtString, secret);
    return true;
  } catch (e) {
    return false;
  }
};
