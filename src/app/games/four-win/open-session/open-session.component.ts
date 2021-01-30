import { AfterViewInit, Component, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-open-session',
  templateUrl: './open-session.component.html',
  styleUrls: ['./open-session.component.scss']
})
export class OpenSessionComponent implements OnInit, AfterViewInit {

  socket: Socket;
  session: string;
  url: string;

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.socket = io('http://localhost:3000');
    this.socket.emit('newGame', 1);
    this.socket.on('gameRdy', (data: any) => {
      this.session = data.session;
      this.url = 'http://localhost:4200/four-win/' + data.session;
    });
  }

  ngAfterViewInit(): void {
    this.socket.on('opponentRdy', (data: any) => {
      console.log(data);
      this.router.navigate(['four-win/' + this.session]);
    });
  }

}
