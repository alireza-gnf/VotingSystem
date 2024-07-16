export interface Vision {
  id?: string;
  title: string;
  description: string;
  planDeadline: Date;
  voteDeadline: Date;
}

class VisionManagement {
  private visions: Array<Vision> = [];
  private last_id: number = 0;

  private generateId(): string {
    return (++this.last_id).toString();
  }

  all(): Array<Vision> {
    return this.visions;
  }

  add(vision: Vision) {
    this.visions.push({ ...vision, id: this.generateId() });
  }

  find(id: string): Vision | undefined {
    return this.visions.find((vision) => vision.id === id);
  }
}

export const visions = new VisionManagement();
