import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass the saved counter to CounterService and show a toast', async () => {
    const service = TestBed.inject(CounterService);
    const addSpy = vi.spyOn(service, 'add').mockResolvedValue(undefined);

    const present = vi.fn();
    const toastController = TestBed.inject(ToastController);
    const createSpy = vi
      .spyOn(toastController, 'create')
      .mockResolvedValue({ present } as unknown as HTMLIonToastElement);

    const counter: SavedCounter = {
      id: 'first',
      name: 'První',
      value: 1,
      createdAt: '2026-09-17T08:00:00.000Z',
    };

    await component.onSaved(counter);

    expect(addSpy).toHaveBeenCalledWith(counter);
    expect(createSpy).toHaveBeenCalled();
    expect(present).toHaveBeenCalled();
  });
});