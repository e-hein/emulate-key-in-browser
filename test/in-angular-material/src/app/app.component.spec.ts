import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { testApp } from '@app/testing';
import { SharedSpecContextWithFixture } from '@app/testing/testbed';
import { AppComponent } from './app.component';

@Component({ template: '<app-root></app-root>'})
class StageComponent {}

describe('app component', () => {
  const context = new SharedSpecContextWithFixture();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSidenavModule,
        MatTableModule,
        MatTooltipModule,
        NoopAnimationsModule,
      ],
      declarations: [AppComponent, StageComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(StageComponent);

    fixture.autoDetectChanges(true);
    await fixture.whenStable();

    await context.updateFixture(fixture);
  });

  testApp(context);
});
