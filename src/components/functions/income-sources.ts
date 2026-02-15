import { db } from './dbHelper';

const incomeDB = db('income_sources');

export const getIncomeSourcesFunction = async (userId: string) => {
  try {
    return await incomeDB.findMany(
      { column: 'user_id', value: userId },
      { column: 'created_at', ascending: false }
    );
  } catch (err) {
    return [];
  }
};

export const addIncomeSourceFunction = async (payload: any) => {
  try {
    const result = await incomeDB.insert(payload);
    return result;
  } catch (err) {
    return null;
  }
};

export const updateIncomeSourceFunction = async (id: any, payload: any) => {
  try {
    await incomeDB.update({ column: 'id', value: id }, payload);
    return true;
  } catch (err) {
    return false;
  }
};

export const deleteIncomeSourceFunction = async (id: any) => {
   try {
    await incomeDB.delete({ column: 'id', value: id });
    return true;
  } catch (err) {
    return false;
  }
};