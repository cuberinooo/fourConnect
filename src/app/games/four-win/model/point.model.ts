export class Point {

  constructor(x: number, y: number) {

    this.x = x;
    this.y = y;
    this.state = 'start';
    this.color = '';
    this.containerState = 'open';

  }

  public containerState: string;
  public color: string;
  public x: number;
  public y: number;
  public state: string;
}
