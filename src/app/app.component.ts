import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { UserComponent } from "./user/user.component";
import { DummyUsers } from "./user/dummy-users";
import { User } from '../models/user.models';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  user = DummyUsers;

  ngOnInit() {
    console.log('abcde')
  }

  onSelectUser(user: User) {
    console.log('User wurde selektiert');
    console.log("Der aktuelle Name ist: " + user.name);
  }
}
