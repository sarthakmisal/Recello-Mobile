import { QuestionAnswer } from '../models/sell-flow.models';
import { SellQuestion } from '../models/catalog.models';

/**
 * Drives the "one question per screen" wizard.
 * Root questions are any question never referenced by another option's `show`
 * list; those referenced ids get inserted into the queue right after the
 * question whose option revealed them, mirroring a typical conditional
 * follow-up ("Any scratches?" → yes → "How many?").
 */
export class QuestionFlow {
  private byId = new Map<number, SellQuestion>();
  private queue: number[] = [];
  private cursor = 0;
  private answers = new Map<number, number[]>();

  constructor(questions: SellQuestion[]) {
    questions.forEach((q) => this.byId.set(q.id, q));
    const childIds = new Set<number>();
    questions.forEach((q) => q.options.forEach((o) => o.show.forEach((id) => childIds.add(id))));
    this.queue = questions.filter((q) => !childIds.has(q.id)).map((q) => q.id);
  }

  get total(): number {
    return this.queue.length;
  }

  get position(): number {
    return this.cursor + 1;
  }

  get isFinished(): boolean {
    return this.cursor >= this.queue.length;
  }

  current(): SellQuestion | null {
    if (this.isFinished) return null;
    return this.byId.get(this.queue[this.cursor]) ?? null;
  }

  /** Records the answer for the current question and advances the cursor. */
  answer(optionIds: number[]): void {
    const q = this.current();
    if (!q) return;
    this.answers.set(q.id, optionIds);

    const toInsert: number[] = [];
    q.options
      .filter((o) => optionIds.includes(o.id))
      .forEach((o) => o.show.forEach((childId) => {
        if (this.byId.has(childId) && !this.queue.includes(childId)) toInsert.push(childId);
      }));

    if (toInsert.length) this.queue.splice(this.cursor + 1, 0, ...toInsert);
    this.cursor++;
  }

  back(): void {
    if (this.cursor > 0) this.cursor--;
  }

  canGoBack(): boolean {
    return this.cursor > 0;
  }

  /** Restores a previously given answer for the current question, if any. */
  answerFor(questionId: number): number[] {
    return this.answers.get(questionId) ?? [];
  }

  getAnswers(): QuestionAnswer[] {
    return Array.from(this.answers.entries()).map(([question_id, option_ids]) => ({ question_id, option_ids }));
  }
}
