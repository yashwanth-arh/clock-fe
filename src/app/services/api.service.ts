import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_BP = "https://rpmdev.xyramsoft.com:444/rpm-poc/ihealth/bp";
  private API_GLUCOSE = "https://rpmdev.xyramsoft.com:444/rpm-poc/ihealth/glucose";
  private API_WEIGHT = "https://rpmdev.xyramsoft.com:444/rpm-poc/ihealth/weight";
  private API_BO ="https://rpmdev.xyramsoft.com:444/rpm-poc/ihealth/bloodoxygen";

  constructor(private httpClient: HttpClient) {
  }
  // getData(hospital: string) {
  //   return this.user.filter((x: { hospital: any }) => x.hospital == hospital);
  // }

  public getPatientBPData(){
    return this.httpClient.get(this.API_BP);
  }

  public getPatientBOData(){
    return this.httpClient.get(this.API_BO);
  }

  public getPatientWeightData(){
    return this.httpClient.get(this.API_WEIGHT);
  }

  getDisease() {
    return this.httpClient.get('https://jsonplaceholder.typicode.com/todos/1');
  }
  saveDisease(data) {
    return this.httpClient.post('https://jsonplaceholder.typicode.com/todos/1', data);
  }
  updateDisease(id) {
    return this.httpClient.put('https://jsonplaceholder.typicode.com/todos/1', id);
  }
  getCPTCode() {
    return this.httpClient.get('https://jsonplaceholder.typicode.com/todos/1');
  }
  saveCPTCode(data) {
    return this.httpClient.post('https://jsonplaceholder.typicode.com/todos/1', data);
  }
  updateCPTCode(id) {
    return this.httpClient.put('https://jsonplaceholder.typicode.com/todos/1', id);
  }
  getTicket() {
    return this.httpClient.get('https://jsonplaceholder.typicode.com/todos/1');
  }
  saveTicket(data) {
    return this.httpClient.post('https://jsonplaceholder.typicode.com/todos/1', data);
  }
  updateTicket(id) {
    return this.httpClient.put('https://jsonplaceholder.typicode.com/todos/1', id);
  }
}
