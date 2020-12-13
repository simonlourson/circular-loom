import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlgoAndCompareComponent } from './algo-and-compare/algo-and-compare.component';
import { PrintDrillGuideComponent } from './print-drill-guide/print-drill-guide.component';
import { LoomHelperComponent } from './loom-helper/loom-helper.component';
import { MultiLoomComponent } from './multi-loom/multi-loom.component';

const routes: Routes = [
  {
    path: 'algo',
    component: AlgoAndCompareComponent
  },
  {
    path: 'print',
    component: PrintDrillGuideComponent
  },
  { path: 'loom/:id', component: LoomHelperComponent },
  { path: 'multiloom/:fileIds', component: MultiLoomComponent },
  {
    path: 'loom',
    component: LoomHelperComponent
  },
  {
    path: '**',
    redirectTo: 'algo'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
