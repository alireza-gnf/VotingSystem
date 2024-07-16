export interface Plan {
  id?: string;
  visionId: string;
  userId: string;
  description: string;
}

class PlanManagement {
  private plans: Array<Plan> = [];
  private last_id: number = 0;

  private generateId(): string {
    return (++this.last_id).toString();
  }

  all(): Array<Plan> {
    return this.plans;
  }

  add(plan: Plan) {
    this.plans.push({ ...plan, id: this.generateId() });
  }

  visionPlans(id: string): Array<Plan> {
    return this.plans.filter((plan) => plan.id === id);
  }

  find(id: string): Plan | undefined {
    return this.plans.find((plan) => plan.id === id);
  }
}

export const plans = new PlanManagement();
