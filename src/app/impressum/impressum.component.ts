import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-impressum',
  standalone: true,
  templateUrl: './impressum.component.html',
  styleUrl: './impressum.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImpressumComponent {}
