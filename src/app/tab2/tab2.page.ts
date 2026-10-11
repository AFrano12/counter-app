import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';

export type SortOption = 'newest' | 'oldest' | 'name' | 'value';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  readonly searchTerm = signal('');
  readonly sortBy = signal<SortOption>('newest');
  readonly total = computed(() =>
    this.counterService
      .counters()
      .reduce((sum, counter) => sum + counter.value, 0),
  );

  readonly valueStats = computed(() => {
    const counters = this.counterService.counters();

    return {
      positive: counters.filter((counter) => counter.value > 0).length,
      negative: counters.filter((counter) => counter.value < 0).length,
      zero: counters.filter((counter) => counter.value === 0).length,
    };
  });


  readonly visibleCounters = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    const filtered = this.counterService
      .counters()
      .filter((counter) => counter.name.toLowerCase().includes(term));

    return [...filtered].sort((a, b) => this.compare(a, b, this.sortBy()));
  });

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  onSearch(value: string | null | undefined): void {
    this.searchTerm.set(value ?? '');
  }

  onSortChange(value: SortOption): void {
    this.sortBy.set(value);
  }

  async remove(counter: SavedCounter): Promise<void> {
    await this.counterService.remove(counter.id);
    await this.showToast(`Záznam „${counter.name}“ byl odstraněn.`);
  }

  async confirmClear(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Vymazat historii?',
      message: 'Opravdu chcete odstranit všechny záznamy? Akci nelze vrátit.',
      buttons: [
        { text: 'Zrušit', role: 'cancel' },
        { text: 'Vymazat', role: 'destructive', handler: () => this.clear() },
      ],
    });
    await alert.present();
  }

  async clear(): Promise<void> {
    await this.counterService.clear();
    await this.showToast('Historie byla vymazána.');
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }

  private compare(a: SavedCounter, b: SavedCounter, sortBy: SortOption): number {
    switch (sortBy) {
      case 'oldest':
        return a.createdAt.localeCompare(b.createdAt);
      case 'name':
        return a.name.localeCompare(b.name, 'cs');
      case 'value':
        return b.value - a.value;
      case 'newest':
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  }
}