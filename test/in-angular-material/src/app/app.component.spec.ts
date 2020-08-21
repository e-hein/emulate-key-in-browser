import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { testApp } from 'src/testing';
import { AppComponent } from './app.component';

@Component({ template: '<app-root></app-root>'})
class StageComponent {}

describe('app component', () => {
  let fixture: ComponentFixture<StageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatSidenavModule,
        MatTableModule,
        MatTooltipModule,
        NoopAnimationsModule,
      ],
      declarations: [AppComponent, StageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(StageComponent);
    fixture.autoDetectChanges(true);
    await fixture.whenStable();
  });

  testApp(() => TestbedHarnessEnvironment.loader(fixture), () => Promise.resolve(document.activeElement?.id));
});
