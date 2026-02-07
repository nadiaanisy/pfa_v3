import { supabase } from '../../miscellaneous/supabaseClient';

type WhereCondition = {
  column: string;
  value: any;
};

class DBHelper {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  async insert<T>(data: Partial<T>): Promise<T> {
    const { data: result, error } = await supabase
      .from(this.table)
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result as T;
  }

  async findOne<T>(where: WhereCondition): Promise<T> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq(where.column, where.value)
      .single();

    if (error || !data) {
      throw new Error("No record found with the credentials provided");
    }

    return data as T;
  }

  async update(where: WhereCondition, data: Record<string, any>) {
    const { error } = await supabase
      .from(this.table)
      .update(data)
      .eq(where.column, where.value);

    if (error) throw new Error(error.message);
  }
}

export const db = (table: string) => new DBHelper(table);