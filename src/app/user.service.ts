import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  updateUser(userId: number, userData: any) {
    console.log('Usuario editado');
    return this.http.put(`https://65cc0e65e1b51b6ac484466c.mockapi.io/api/users/${userId}`, userData);
  }

  deleteUser(userId: number) {
    console.log('Usuario eliminado');
    return this.http.delete(`https://65cc0e65e1b51b6ac484466c.mockapi.io/api/users/${userId}`);
  }

}
