import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private _id: string;
  public socket: Socket;
  private _myTurn: boolean;

  constructor() {

    const id = window.localStorage.getItem('id');
    if (!id) {
      this.socket = io('localhost:3000');
    } else {
      this.socket = io('localhost:3000', { query: 'id=' + id });
    }

  }

  set id(value: string) {
    window.localStorage.setItem('id', value);
    this._id = value;
  }

  get id(): string {
    return this._id;
  }

  get myTurn(): boolean {
    return this._myTurn;
  }

  set myTurn(value: boolean) {
    this._myTurn = value;
  }

}
