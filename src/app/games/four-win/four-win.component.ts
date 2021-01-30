import { AfterViewInit, Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Point } from './model/point.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { WinnerDialogComponent } from './winner-dialog/winner-dialog.component';
import { io } from 'socket.io-client';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-four-win',
  templateUrl: './four-win.component.html',
  styleUrls: ['./four-win.component.scss'],
  animations: [
    trigger('moveCircle', [
      state('start', style({
        'background-color': '{{bg-color}}',
        transform: 'translate(0, 0)'
      }), { params: { 'bg-color': 'red' } }),
      state('end', style({
        'background-color': '{{bg-color}}',
        visibility: 'unset',
        transform: 'translate(0, {{yPosition}}px)'
      }), { params: { yPosition: 0, 'bg-color': 'red' } }),
      transition('* => end', [
        animate('1s', keyframes([
          style({ 'background-color': '{{bg-color}}', offset: 0 }),
          style({ visibility: 'unset', offset: 0 }),
          style({ transform: 'translateY(0)', offset: 0 }),
          style({ transform: 'translateY({{yPosition}}px)', offset: 0.6 }),
          style({ transform: 'translateY({{yHop1}}px)', offset: 0.7 }),
          style({ transform: 'translateY({{yPosition}}px)', offset: 0.8 }),
          style({ transform: 'translateY({{yHop2}}px)', offset: 0.9 }),
          style({ transform: 'translateY({{yPosition}}px)', offset: 1 })
        ]))
      ], { params: { yPosition: 0, yHop1: 0, yHop2: 0, 'bg-color': 'red' } })
    ]),
    trigger('hideContainer', [
      state('open', style({ 'z-index': 2 })),
      state('hide', style({ 'z-index': 1 })),
      transition('open => remove', [animate('0.5s')])
    ])]
})
export class FourWinComponent implements OnInit, AfterViewInit, OnDestroy {

  gridItems: string[];
  gridTopItems: number[][];
  points: Point[][];
  yHop1: number;
  yHop2: number;
  clickable: boolean;
  count: number;
  nextColor: string;
  currentColor: string;

  constructor(private dialog: MatDialog, private globalService: GlobalService) {
    this.gridItems = [];
    this.gridTopItems = [];
    this.points = [];
  }

  ngOnInit(): void {
    this.globalService.socket.on('connected', (data: any) => {
      this.globalService.id = data.id;
      this.globalService.myTurn = true;
    });

    this.createGrid();

    window.onbeforeunload = () => this.ngOnDestroy();
  }

  ngAfterViewInit(): void {
    this.globalService.socket.on('newCircle', (data: any) => {
      this.globalService.myTurn = true;
      this.setCircle(data.row, data.column);
    });
  }

  ngOnDestroy(): void {
    this.globalService.socket.emit('logout', { id: this.globalService.id });
    window.localStorage.clear();
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { color: this.currentColor };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(WinnerDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.createGrid();
    });
  }

  setCircle(row: number, column: number, synchronize = false): void {

    if (this.globalService.myTurn) {
      if (synchronize) {
        this.globalService.myTurn = false;
        this.globalService.socket.emit('setCircle', { row: row, column: column });
      }
      const point = this.points[row][column];
      if (this.clickable) {
        this.clickable = false;
        if (point.state !== 'end') {
          point.containerState = 'hide';

          if (this.count % 2 === 0) {
            this.currentColor = point.color = 'yellow';
            this.nextColor = 'red';
          } else {
            this.currentColor = point.color = 'red';
            this.nextColor = 'yellow';
          }
          point.y = (89 * (row + 1));
          this.yHop1 = point.y - 70;
          this.yHop2 = point.y - 40;
          point.state = 'end';
          this.count++;
        }
        if (this.checkFourConnect(row, column, 0, point.color)) {
          this.openDialog();
        }
        this.delay(1000);
      }
    }
  }

  private delay(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(() => this.clickable = true, ms));
  }

  checkFourConnect(row: number, column: number, count: number, color: string, caseConnect = 'all'): boolean {
    if (count === 4) {
      return true;
    } else if (this.points[row] === undefined || this.points[row][column] === undefined || this.points[row][column].color === undefined) {
      return false;
    } else if (color !== this.points[row][column].color) {
      return false;
    } else {

      switch (caseConnect) {
        case 'right':
          return this.checkFourConnect(row + 1, column, count + 1, color, 'right');
        case 'left':
          return this.checkFourConnect(row - 1, column, count + 1, color, 'left');
        case 'top':
          return this.checkFourConnect(row, column + 1, count + 1, color, 'top');
        case 'bottom':
          return this.checkFourConnect(row, column - 1, count + 1, color, 'bottom');
        case 'dTopRight':
          return this.checkFourConnect(row + 1, column + 1, count + 1, color, 'dTopRight');
        case 'dTopLeft':
          return this.checkFourConnect(row - 1, column + 1, count + 1, color, 'dTopLeft');
        case 'dBottomRight':
          return this.checkFourConnect(row + 1, column - 1, count + 1, color, 'dBottomRight');
        case 'dBottomLeft':
          return this.checkFourConnect(row - 1, column - 1, count + 1, color, 'dBottomLeft');
        case 'all':
          return this.checkFourConnect(row + 1, column, count + 1, color, 'right') ||
            this.checkFourConnect(row - 1, column, count + 1, color, 'left') ||
            this.checkFourConnect(row, column + 1, count + 1, color, 'top') ||
            this.checkFourConnect(row, column - 1, count + 1, color, 'bottom') ||
            this.checkFourConnect(row + 1, column + 1, count + 1, color, 'dTopRight') ||
            this.checkFourConnect(row - 1, column + 1, count + 1, color, 'dTopLeft') ||
            this.checkFourConnect(row + 1, column - 1, count + 1, color, 'dBottomRight') ||
            this.checkFourConnect(row - 1, column - 1, count + 1, color, 'dBottomLeft');
        default:
          return false;
      }
    }
  }

  createGrid(): void {
    this.count = 1;
    this.gridItems = [];
    this.nextColor = 'red';
    this.currentColor = '';
    this.clickable = true;
    this.gridTopItems = [];

    for (let i = 0; i <= 6; i++) {
      this.gridTopItems[i] = [];
      for (let z = 0; z <= 5; z++) {
        this.gridTopItems[i][z] = z;
      }
    }

    for (let i = 0; i <= 5; i++) {
      this.points[i] = [];
      for (let z = 0; z <= 6; z++) {
        this.points[i][z] = new Point(0, 0);
        this.gridItems.push(i + '/' + z);
      }
    }
  }
}
