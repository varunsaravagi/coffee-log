declare module "better-sqlite3" {
  type RunResult = {
    changes: number;
    lastInsertRowid: number | bigint;
  };

  type Statement<BindParameters extends unknown[] = unknown[]> = {
    run(...params: BindParameters): RunResult;
    get<T>(...params: BindParameters): T;
    all<T>(...params: BindParameters): T[];
  };

  class Database {
    constructor(filename?: string, options?: { readonly?: boolean; fileMustExist?: boolean });
    exec(sql: string): this;
    prepare<BindParameters extends unknown[] = unknown[]>(sql: string): Statement<BindParameters>;
    pragma(source: string): unknown;
    close(): void;
  }

  export default Database;
}

