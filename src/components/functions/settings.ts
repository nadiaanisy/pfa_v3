import bcrypt from 'bcryptjs';
import { db } from './dbHelper';

const usersDB = db("users");

export const fetchCurrentUserFunction = async (userId: string) => {
  try {
    const user = await usersDB.findOne({ column: "id", value: userId });
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  } catch (err: any) {
    return null;
  }
};

export const updateUserAvatarFunction = async (user: any, base64: any) => {
  try {
    await usersDB.update(
      { column: "id", value: user.id },
      { avatar_url: base64 }
    );

    return true;
  } catch (err: any) {
    return false;
  }
};

export const updateUserProfileFunction = async (payload: any) => {
  try {
    await usersDB.update(
      { column: "id", value: payload.id },
      {
        fullname: payload.fullname,
        username: payload.username,
        email: payload.email
      }
    )
    return true;
  } catch (err: any) {
    return false;
  }
};

export const updateUserPasswordFunction = async (payload: any) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (!currentUser) return false;

  const isCurrentValid = bcrypt.compareSync(
    payload.currentPassword,
    currentUser.password_hash
  );

  if (!isCurrentValid) {
    throw new Error("Current password is incorrect");
  }

  const isCurrentSameAsNew = bcrypt.compareSync(
    payload.newPassword,
    currentUser.password_hash
  );

  if (isCurrentSameAsNew) {
    throw new Error("New password cannot be the same as the current password");
  }

  const hashedPassword = bcrypt.hashSync(payload.newPassword, 10);

  try {
    await usersDB.update(
      { column: "id", value: currentUser.id },
      { password_hash: hashedPassword }
    );
    return true;
  } catch (err: any) {
    return false;
  }
};