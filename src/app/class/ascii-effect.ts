class Cell {
    constructor(
      public x: number,
      public y: number,
      public size: number,
      public color: string,
      public symbol: string
    ){
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = color;
      this.symbol = symbol;
    }
    draw(ctx: CanvasRenderingContext2D | null) {
      if (ctx) {
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px monospace`;
        ctx.fillText(this.symbol, this.x, this.y);
      }
    }
  }

export class AsciiEffect {
  private _imageCellArr:Cell[] = [];
  private _pixels: ImageData | undefined;
  private _ctx: CanvasRenderingContext2D | null = null;
  private _width = 0;
  private _height = 0;

  constructor(
    public ctx: CanvasRenderingContext2D | null,
    public width: number,
    public height: number,
    public image: HTMLImageElement
  ) {
    this._ctx = ctx;
    this._width = width;
    this._height = height;
    this._ctx?.drawImage(image,0,0, this._width, this._height);
    this._pixels = this._ctx?.getImageData(0, 0, this._width, this._height);

  }

  private convertToGrayscale(r: number, g: number, b: number): number {
    return 0.21 * r + 0.72 * g + 0.07 * b;
  }

  private convertToSymbol(averageColor: number): string {
    //we go down 10 steps of brightness and assign a symbol to each step
    if (averageColor >= 250) return '@';
    else if (averageColor >= 240) return '*';
    else if (averageColor >= 230) return '+';
    else if (averageColor >= 220) return '#';
    else if (averageColor >= 210) return '&';
    else if (averageColor >= 200) return '%';
    else if (averageColor >= 180) return ':';
    else if (averageColor >= 160) return '/';
    else if (averageColor >= 140) return 'X';
    else if (averageColor >= 120) return '$';
    else if (averageColor >= 100) return '-';
    else if (averageColor >= 80) return 'W';
    else if (averageColor >= 60) return '^';
    else if (averageColor >= 40) return '_';
    else if (averageColor >= 20) return '!';
    else if (averageColor >= 0) return 'x';
    else return ' ';
  }

  private parseImage(cellsize:number){
    this._imageCellArr = [];
    if(!this._pixels) return;

    for (let  y=0; y < this._pixels.height; y+=cellsize){
      for (let x=0; x < this._pixels.width; x+=cellsize){
       const posX = x * 4;
        const posY = y * 4;
        const pos = (posY * this._pixels.width) + posX;

        if (this._pixels.data[pos + 3] > 128){
          const r = this._pixels.data[pos];
          const g = this._pixels.data[pos + 1];
          const b = this._pixels.data[pos + 2];
          const averageColor = (r + g + b) / 3;
          const color = `rgb(${r}, ${g}, ${b})`;
          const symbol = this.convertToSymbol(averageColor);
          this._imageCellArr.push(new Cell(x, y, cellsize, color, symbol));
        }
      }
    }

  }

  private drawAscii(){
    this._ctx?.clearRect(0, 0, this._width, this._height);
    for (let i = 0; i < this._imageCellArr.length; i++) {
      this._imageCellArr[i].draw(this._ctx);
    }
  }

  public draw(cellsize:number){
    this.parseImage(cellsize);
    this.drawAscii();
  }
}

