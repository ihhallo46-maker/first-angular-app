import { Component, OnInit } from '@angular/core';
import { HeaderCompoent } from "./header/header.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderCompoent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  ngOnInit() {
    console.log('abcde')
  }

}
