import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';


@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [LayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    
  ],exports: [],
})
export class LayoutModule { }