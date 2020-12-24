import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlgoAndCompareComponent } from './components/algo-and-compare/algo-and-compare.component';

import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { PrintDrillGuideComponent } from './components/print-drill-guide/print-drill-guide.component';
import { HttpClientModule } from '@angular/common/http';
import { LoomHelperComponent } from './components/loom-helper/loom-helper.component';
import { MultiLoomComponent } from './components/multi-loom/multi-loom.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ButtonModule, SliderModule, InputTextModule, InputNumberModule, DropdownModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    AlgoAndCompareComponent,
    PrintDrillGuideComponent,
    LoomHelperComponent,
    MultiLoomComponent,
    ImageUploaderComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
