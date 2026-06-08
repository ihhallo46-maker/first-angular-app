import { Component, OnInit } from "@angular/core";
import { RouterLinkActive, RouterModule } from "@angular/router";

@Component ({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrl: 'header.component.scss',
    imports: [RouterModule]
})
export class HeaderComponent implements OnInit {

    ngOnInit() {
        
    }
}