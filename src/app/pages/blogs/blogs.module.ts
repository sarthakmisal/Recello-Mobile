import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { BlogsPage } from './blogs.page';

const routes: Routes = [{ path: '', component: BlogsPage }];

@NgModule({
  declarations: [BlogsPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class BlogsPageModule { }
