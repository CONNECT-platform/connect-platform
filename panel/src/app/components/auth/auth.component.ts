import { Component, OnInit } from '@angular/core';

import { TokenService } from '../../services/token.service';


@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  private given: string;

  constructor(
    public token: TokenService
  ) { }

  ngOnInit() {
  }

  auth() {
    this.token.token = this.given;
    this.token.goback();
  }
}
