import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-datenschutz',
  standalone: true,
  templateUrl: './datenschutz.component.html',
  styleUrl: './datenschutz.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatenschutzComponent {}
