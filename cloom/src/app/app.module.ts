import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlgoAndCompareComponent } from './algo-and-compare/algo-and-compare.component';

import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { PrintDrillGuideComponent } from './print-drill-guide/print-drill-guide.component';
import { HttpClientModule } from '@angular/common/http';
import { LoomHelperComponent } from './loom-helper/loom-helper.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ButtonModule, SliderModule, InputTextModule, InputNumberModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    AlgoAndCompareComponent,
    PrintDrillGuideComponent,
    LoomHelperComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
