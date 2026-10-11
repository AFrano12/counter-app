import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
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

  readonly searchTerm = signal('');
  readonly sortBy = signal<SortOption>('newest');

  // Součet hodnot všech uložených počítadel (bez ohledu na vyhledávání).
  readonly total = computed(() =>
    this.counterService
      .counters()
      .reduce((sum, counter) => sum + counter.value, 0),
  );

  // Záznamy po vyhledání podle názvu a seřazení.
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

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
  }

  async clear(): Promise<void> {
    await this.counterService.clear();
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
