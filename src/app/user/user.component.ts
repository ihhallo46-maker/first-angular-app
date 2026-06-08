import { Component, EventEmitter, Input, OnInit, Output, input } from '@angular/core';
import { DummyUsers } from './dummy-users';
import { required } from '@angular/forms/signals';
import { User } from '../../models/user.models';



@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: 'user.component.html',
  styleUrl: 'user.component.scss',
})

export class UserComponent implements OnInit {
 @Input({required: true}) id!: string;
 @Input({required: true}) name!: string;
 @Output() select = new EventEmitter<User>();

  ngOnInit(): void {
    return
  }

  onSelectedUser() {
    console.log('User wurde selektiert');
    this.select.emit({id: this.id, name: this.name});
  }
}