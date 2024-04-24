import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  routerUrl: string;
  @Input() gifBackground: string;

  constructor(private route: ActivatedRoute) {
    this.routerUrl = route?.snapshot?.routeConfig?.path;
  }

}
