import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../models/user.model';
import { catchError, finalize, of } from 'rxjs';

const PHONE_PATTERN = /^[0-9+\-]*$/;
@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent {
  editUser: User;
  userForm!: FormGroup;
  isLoading = false;
  selectedFile: File | undefined;
  imageBase64: string | ArrayBuffer | null = '';


  constructor(
    public dialogRef: MatDialogRef<UserUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private UserService: UserService,
    private formBuilder: FormBuilder) {
    // Copia del objeto para no modificar el original
    this.editUser = { ...data };

    this.userForm = this.formBuilder.group({
      nombres: [this.editUser.nombres, Validators.required],
      apellidos: [this.editUser.apellidos, Validators.required],
      email: [this.editUser.email, [Validators.required, Validators.email]],
      celular: [this.editUser.celular, [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      foto: [this.editUser.foto]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
    return;
  }

  onEditUser(): void {
    // Lógica para editar usuario
    if(this.userForm.valid) {
      this.isLoading = true;
      const updatedUserData = this.userForm.value;
      if(this.imageBase64){
        updatedUserData.foto = this.imageBase64 as string;
      }else{
        updatedUserData.foto = this.editUser.foto;
      }

      this.UserService.updateUser(this.editUser.id, updatedUserData)
      .pipe(
        catchError((error) => {
          console.error('Error al editar usuario', error);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(updatedUser => {
        if(updatedUser) {
          console.log('Usuario editado', updatedUser);
          this.dialogRef.close(updatedUser);
          //window.location.reload();
        } else {
          console.error('Usuario no editado');
        }
      }
      );
    } else {
      console.error('Formulario inválido');
    }

  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      if (event.target.files[0].size > 1048576) {
        alert('No fue posible editar el usuario, tamaño de imagen excede el límite de 1MB');
        event.target.value = '';
        return;
      }

      if(event.target.files[0].type.split('/')[0] !== 'image'){
        alert('No fue posible editar el usuario, archivo seleccionado no es una imagen');
        event.target.value = '';
        return;
      }
      this.selectedFile = event.target.files[0];
      this.convertToBase64();

    }
  }

  convertToBase64(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.imageBase64 = reader.result;
      };
    }
  }
}
