import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-takeaway',
  standalone: true,
  templateUrl: './takeaway.component.html',
  styleUrl: './takeaway.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakeawayComponent {}