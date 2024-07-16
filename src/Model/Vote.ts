export interface Vote {
  id?: string;
  planId: string;
  userId: string;
}

class VoteManagement {
  private votes: Array<Vote> = [];
  private last_id: number = 0;

  private generateId(): string {
    return (++this.last_id).toString();
  }

  all(): Array<Vote> {
    return this.votes;
  }

  add(vote: Vote) {
    this.votes.push({ ...vote, id: this.generateId() });
  }

  planVotes(id: string): Array<Vote> {
    return this.votes.filter((vote) => vote.planId === id);
  }
}

export const votes = new VoteManagement();
