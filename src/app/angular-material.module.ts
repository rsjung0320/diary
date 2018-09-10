import { NgModule } from '@angular/core';

import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule
} from '@angular/material';

@NgModule({
  imports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ]
})
export class AngularMaterialModule {}

