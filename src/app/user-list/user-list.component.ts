import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UserUpdateComponent } from '../user-update/user-update.component';
import { UserDeleteComponent } from '../user-delete/user-delete.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users: any[] = [];
  displayedColumns: string[] = ['id', 'nombres', 'apellidos', 'email', 'celular', 'foto', 'acciones'];
  dataSource = new MatTableDataSource(this.users);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.http.get('https://65cc0e65e1b51b6ac484466c.mockapi.io/api/users').subscribe((data: any) => {
      this.users = data;
      console.log(data);
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
    });
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  editarUsuario(user: any): void {
    // Lógica para editar usuario
    const dialogRef = this.dialog.open(UserUpdateComponent, {
      width: '700px',
      height: '600px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The update dialog was closed');
      if(result){
        const index = this.users.findIndex((user) => user.id === result.id);
        if(index !== -1) {
          this.users[index] = result;
          this.dataSource = new MatTableDataSource(this.users);
          this.dataSource.paginator = this.paginator;
        }
      }
    });
  }

  eliminarUsuario(userId: number): void {
    // Lógica para eliminar usuario
    const dialogRef = this.dialog.open(UserDeleteComponent, {
      width: '250px',
      data: userId
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log('Usuario eliminado');
        const index = this.users.findIndex((user) => user.id === userId);
        if(index !== -1) {
          this.users.splice(index, 1);
          this.dataSource = new MatTableDataSource(this.users);
          this.dataSource.paginator = this.paginator;
        }
      } else {
      console.log('The delete dialog was closed');
      }
    });
  }
}
