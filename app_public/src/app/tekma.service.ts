import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TekmaService {

  constructor(private webReqService: WebRequestService) { }

  createList(title: string) {
    this.webReqService.post('/', { title });
  }
}
