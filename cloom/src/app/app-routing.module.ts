import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintDrillGuideComponent } from './components/print-drill-guide/print-drill-guide.component';
import { LoomHelperComponent } from './components/loom-helper/loom-helper.component';
import { MultiLoomComponent } from './components/multi-loom/multi-loom.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';

const routes: Routes = [
  {
    path: 'preview',
    component: ImageUploaderComponent
  },
  {
    path: 'print',
    component: PrintDrillGuideComponent
  },
  { path: 'loom/:id', component: LoomHelperComponent },
  { path: 'multiloom/:fileIds', component: MultiLoomComponent },
  { path: 'replay/:fileIds', component: MultiLoomComponent },
  {
    path: 'loom',
    component: LoomHelperComponent
  },
  {
    path: '**',
    redirectTo: 'preview'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
