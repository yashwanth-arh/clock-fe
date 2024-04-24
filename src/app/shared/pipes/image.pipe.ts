import { HttpClient } from "@angular/common/http";
import { PipeTransform, Pipe } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from 'rxjs/operators';
@Pipe({ name: "image" })
export class ImagePipe implements PipeTransform {
  defaultImage = "assets/svg/DashboardIcons/Patient.svg";

  constructor(private http: HttpClient) { }

  transform(url: string): any {
    return this.http
      .get(url)
      .pipe(map(res => {
        //return url if valid
        return url;
      }), catchError((err, caught) => {
        return this.defaultImage;
      }))
  }
}
