import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { AsciiEffect } from './class/ascii-effect';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ascii-app';
  public resolutionForm: FormControl = new FormControl(5);
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement> | undefined;
  public image = new Image();
  public imgageSrc = 'assets/charizard.png';

  public get resolution(): number {
    return this.resolutionForm.value;
  }

  constructor() {
    this.resolutionForm.valueChanges.subscribe(() => {
      this.convertImage();
    });
  }

  ngAfterViewInit(): void {
    this.convertImage();
  }

  public convertImage(){
    let effect;
    const ctx = this.canvas?.nativeElement.getContext('2d');
    if (!ctx) return;
    this.image.src = this.imgageSrc;
    this.image.onload = () => {
      this.canvas?.nativeElement.setAttribute(
        'width',
        `${this.image.width - 400}`
      );
      this.canvas?.nativeElement.setAttribute(
        'height',
        `${this.image.height - 400}`
      );
      effect = new AsciiEffect(
        ctx,
        this.image.width - 400,
        this.image.height - 400,
        this.image
      );
      effect.draw(this.resolution);
    };
  }
}
