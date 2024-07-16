import { Vision } from "./Vision";

export interface User {
  id?: string;
  role: "admin" | "delegate" | "citizen";
  username: string;
  password: string;
}

class UserAccount {
  private accounts: Array<User> = [];
  private last_id: number = 0;

  private generateId(): string {
    return (++this.last_id).toString();
  }

  all(): Array<User> {
    return this.accounts;
  }

  add(user: User) {
    this.accounts.push({ ...user, id: this.generateId() });
  }

  filter(user: Partial<User>): User | undefined {
    return this.accounts.find((account) => {
      return Object.keys(user).every((key) => {
        return user[key as keyof User] === account[key as keyof User];
      });
    });
  }
}

export const users = new UserAccount();
users.add({
  username: "manager",
  password: "manager123",
  role: "admin",
});
users.add({
  username: "republican",
  password: "republican123",
  role: "delegate",
});
users.add({
  username: "democrat",
  password: "democrat123",
  role: "delegate",
});
users.add({
  username: "citizen",
  password: "citizen123",
  role: "citizen",
});
