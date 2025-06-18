import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DemandeService } from '../../services/demande.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-statistique-list',
  templateUrl: './statistique-list.component.html',
  styleUrls: ['./statistique-list.component.scss']
})
export class StatistiqueListComponent implements OnInit {

  // @ViewChild('resultTable') resultTable: any;

  selectedYear: string = new Date().getFullYear().toString();
  availableYears: string[] = [];
  monthlyStats: any[] = [];
  startDate: string = '';
  endDate: string = '';
  dateRangeStats: any[] = [];
  isLoading: boolean = false;
  aggregatedStats: any = null;

  constructor(
    private demandeService: DemandeService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.loadMonthlyStats();
  }

  private loadMonthlyStats(): void {
    this.isLoading = true;
    this.spinner.show();
    this.demandeService.getMonthlyDashboardStats().subscribe({
      next: (data) => {
        this.monthlyStats = data;
        this.spinner.hide();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques mensuelles:', error);
        this.spinner.hide();
        this.isLoading = false;
      }
    });
  }

  loadDemandesByDateRange(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }

    this.isLoading = true;
    this.spinner.show();

    
    this.demandeService.getDemandesByDateRange(this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          if (Array.isArray(data)) {
            this.dateRangeStats = data.slice(0, -1);
            this.aggregatedStats = data[data.length - 1];
          } else {
            console.error('Les données reçues ne sont pas un tableau:', data);
            this.dateRangeStats = [];
            this.aggregatedStats = null;
          }

          setTimeout(() => {
            this.spinner.hide();
            this.isLoading = false;
          }, 300);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des statistiques par date:', error);
          this.dateRangeStats = [];
          this.aggregatedStats = null;
          this.spinner.hide();
          this.isLoading = false;
        }
      });
  }

  onDateSearch(): void {
    this.loadDemandesByDateRange();
  }

  exportToExcel(): void {
    this.isLoading = true;
    this.spinner.show();

    setTimeout(() => {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('monthlyStatsTable'));
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Statistiques');

      const date = new Date();
      const fileName = `statistiques_mensuelles_${date.getFullYear()}_${(date.getMonth() + 1).toString().padStart(2, '0')}.xlsx`;

      XLSX.writeFile(wb, fileName);
      this.spinner.hide();
      this.isLoading = false;
    }, 1000); // Ajout d'un délai pour simuler le temps de traitement
  }
}
