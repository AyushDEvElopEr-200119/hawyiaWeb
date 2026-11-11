/**
 * A tiny critically-damped spring, in Apple's designer terms (see .claude/skills/apple-design):
 * `response` is roughly how quickly it reaches the target, in seconds; `damping` 1 means no
 * overshoot. Re-targeting keeps the current value and velocity, so motion is always
 * interruptible and never jumps.
 */
export class Spring {
  value: number;
  velocity = 0;
  target: number;
  private k: number;
  private c: number;

  constructor(initial = 0, response = 0.35, damping = 1) {
    this.value = initial;
    this.target = initial;
    this.k = (2 * Math.PI / response) ** 2;
    this.c = 2 * damping * Math.sqrt(this.k);
  }

  /** Advance by dt seconds (semi-implicit Euler, sub-stepped for stability). */
  step(dt: number) {
    const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      const a = -this.k * (this.value - this.target) - this.c * this.velocity;
      this.velocity += a * h;
      this.value += this.velocity * h;
    }
    return this.value;
  }

  jump(v: number) { this.value = this.target = v; this.velocity = 0; }

  get settled() { return Math.abs(this.value - this.target) < 0.01 && Math.abs(this.velocity) < 0.01; }
}
