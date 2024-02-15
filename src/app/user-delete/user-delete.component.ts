import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrl: './user-delete.component.css'
})
export class UserDeleteComponent {
  isLoading = false;
  userId: number = 0;
  constructor(
    public dialogRef: MatDialogRef<UserDeleteComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: number) {
      this.userId = data;
    }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onDeleteUser(): void {
    // Lógica para eliminar usuario
    this.isLoading = true;
    this.userService.deleteUser(this.userId)
    .pipe(
      catchError((error) => {
        console.error('Error al eliminar usuario', error);
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe(() => {
      console.log('Usuario eliminado');
      this.dialogRef.close(true);
    });

  }
}
