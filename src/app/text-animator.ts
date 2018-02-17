export class TextAnimator {
  private static readonly possible: string = '!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  interval;
  count = 0;
  constructor(public element: HTMLElement, public message: string, public ms: number) { }

  start() {
    this.count = 0;
    this.interval = setInterval(() => {
      this.redraw();
    }, 1);
  }

  private redraw() {
    if (this.count >= this.message.length) {
      this.element.innerText = this.message;
      clearInterval(this.interval);

    } else {
      this.count += this.ms / this.message.length;
      let randomText = '';
      for (let i = 0; i < this.message.length; ++i) {
        if (this.message[i] === ' ') {
          randomText += ' ';
        } else if (i < Math.random() * this.message.length) {
          randomText += TextAnimator.possible[Math.floor(Math.random() * TextAnimator.possible.length)];
        } else {
          randomText += this.message[i];
        }
      }

      this.element.innerText = randomText;
    }
  }
}
