import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss']
})
export class PreviewImageComponent implements OnInit {
  urlImg: string;
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.urlImg = this.route.snapshot.params.image;
  }

}
