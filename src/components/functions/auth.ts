import bcrypt from 'bcryptjs';
import { db } from './dbHelper';
import {
  ChangePasswordPayload,
  FindAccountPayload,
  LoginPayload,
  RegistrationPayload
} from '../../miscellaneous/Interfaces';

const usersDB = db("users");

export const LoginFunction = async (payload: LoginPayload) => {
  const eq = payload.identifier.includes('@') ? 'email' : 'username';
  const user = await usersDB.findOne<any>({
    column: eq,
    value: payload.identifier,
  })

  const isValid = bcrypt.compareSync(payload.password, user.password_hash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  await updateLastLogin(user.id);
  return user;
};

export const updateLastLogin = async (userId: string) => {
  if (!userId) return;

  usersDB.update(
    { column: "id", value: userId },
    { last_login: new Date().toISOString() }
  );
};

export const RegistrationFunction = async (payload: RegistrationPayload) => {
  const hashedPassword = bcrypt.hashSync(payload.password, 10);

  return usersDB.insert({
    fullname: payload.fullname,
    email: payload.email,
    password_hash: hashedPassword,
    currency: payload.currency,
    username: payload.username,
  });
}

export const FindAccountFunction = async (payload: FindAccountPayload) => {
  const eq = payload.identifier.includes('@') ? 'email' : 'username';
  const user = await usersDB.findOne<any>({
    column: eq,
    value: payload.identifier,
  })
  return { email: user.email, password_hash: user.password_hash };
}

export const ChangePasswordFunction = async (user: any, payload: ChangePasswordPayload) => {
  const isSamePassword = bcrypt.compareSync(
    payload.confirmPassword,
    user.password_hash
  );
  
  if (isSamePassword) {
    throw new Error("New password cannot be the same as the old password");
  }

  const hashedPassword = bcrypt.hashSync(payload.confirmPassword, 10);

  return await usersDB.update(
    { column: "email", value: user.email },
    { password_hash: hashedPassword }
  );
}; 