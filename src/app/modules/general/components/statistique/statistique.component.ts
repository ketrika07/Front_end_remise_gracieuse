import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TauxCrgService } from '../../services/TauxCrg.service';
import { DemandeService } from '../../services/demande.service';
import { Chart , ChartDataset, LineController, LineControllerDatasetOptions, ChartTypeRegistry } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.scss']
})
export class StatistiqueComponent implements OnInit {

  @ViewChild('tauxCanvas') tauxCanvas!: ElementRef;
  @ViewChild('demandesCanvas') demandesCanvas!: ElementRef;
  public chart: any;
  public demandesChart: any;
  public mrDueChart: any;
  public demandesStatsChart: any;
  public totalDemandes: number = 0;
  public demandesTraitees: number = 0;
  public demandesEnAttente: number = 0;
  public montantTotalDu: string = '0.00';
  public demandesByMotifChart: any;
  public demandesByPeriodeChart: any;
  public demandesByEmployeurChart: any;
  selectedYear: string = new Date().getFullYear().toString();
  availableYears: string[] = [];
  monthlyStats: any[] = [];
  startDate: string = '';
  endDate: string = '';
  dateRangeStats: any[] = [];
  isLoading: boolean = false;

  constructor(
    private tauxCrgService: TauxCrgService,
    private demandeService: DemandeService,
    private spinner: NgxSpinnerService
  ) {
    const currentYear = new Date().getFullYear();
    for (let year = 2015; year <= currentYear; year++) {
      this.availableYears.push(year.toString());
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.spinner.show();

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showSpinnerAndLoadData();
    }, 0);
  }

  private showSpinnerAndLoadData(): void{
    this.isLoading = true;
    this.spinner.show();
    setTimeout(() => {
      this.loadTauxStatistics();
      this.loadDemandesStatistics();
      this.loadMrDueStatistics();
      this.loadTotalDemandes();
      this.loadDemandesTraitees();
      this.loadMontantTotalDu();
      this.loadDemandesStatsChart();
      this.loadDemandesEnAttente();
      this.loadMontantParEmployeur();
      this.loadDemandesByMotifChart();
      this.loadDemandesByPeriodeChart();
      this.loadDemandesByEmployeurChart();
      this.spinner.hide();
      this.isLoading = false;
    }, 2000);
  }

  onYearChange(): void {
    this.loadDemandesStatistics();
  }

  private loadTauxStatistics(): void {
    this.spinner.show();
    setTimeout(() => {
      const canvas = this.tauxCanvas.nativeElement;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        this.tauxCrgService.getNombreEmployeursParTaux().subscribe((data: any[]) => {
          const labels = data.map(item => item[1].toString());
          const values = data.map(item => item[2]);

          if (this.chart) {
            this.chart.destroy();
          }

          // 🔥 Nouvelle palette de couleurs en dégradé 🔥
          const colorSchemes = [
            ['rgba(136, 84, 208, 0.9)', 'rgba(224, 86, 253, 0.4)'], // Violet & Rose
            ['rgba(255, 140, 0, 0.9)', 'rgba(255, 215, 0, 0.4)'],  // Orange & Jaune
            ['rgba(52, 172, 224, 0.9)', 'rgba(38, 222, 129, 0.4)'], // Bleu & Turquoise
            ['rgba(255, 82, 82, 0.9)', 'rgba(255, 171, 145, 0.4)']  // Rouge & Corail
          ];

          const gradients = values.map((_, index) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            const colors = colorSchemes[index % colorSchemes.length];
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(1, colors[1]);
            return gradient;
          });

          this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                data: values,
                backgroundColor: gradients,
                hoverBackgroundColor: gradients
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: false, // Masquer la légende pour un graphique en barres
                },
                title: {
                  display: true,
                  text: 'Répartition par taux CRG'
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `Nombre d'employeurs: ${context.raw}`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Règle'
                  }
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Nombre d'employeurs"
                  }
                }
              }
            }
          });

          this.spinner.hide();
        });
      } else {
        console.error('Failed to acquire 2D context');
        this.spinner.hide();
      }
    }, 0);
  }



  private loadDemandesStatistics(): void {
    this.spinner.show();
    setTimeout(() => {
      const ctx = this.demandesCanvas?.nativeElement?.getContext('2d');
      if (ctx) {
        this.demandeService.getDemandesWithinDateRange().subscribe({
          next: (data: any[]) => {
            const filteredData = data.filter(item =>
              new Date(item[3]).getFullYear().toString() === this.selectedYear
            );

            const statsByState = filteredData.reduce((acc: any, item: any[]) => {
              const state = item[4];
              acc[state] = (acc[state] || 0) + 1;
              return acc;
            }, {});

            if (this.demandesChart) {
              this.demandesChart.destroy();
            }

            const colors = this.getRandomColors(Object.keys(statsByState).length);

            this.demandesChart = new Chart(ctx, {
              type: 'pie',
              data: {
                labels: Object.keys(statsByState),
                datasets: [{
                  data: Object.values(statsByState),
                  backgroundColor: colors,
                  hoverBackgroundColor: colors.map(color => color.replace('0.7', '0.9'))
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: `État des demandes pour l'année ${this.selectedYear}`
                  }
                }
              }
            });
            this.spinner.hide();
          },
          error: (error) => {
            console.error('Erreur lors du chargement des statistiques:', error);
            this.spinner.hide();
          }
        });
      } else {
        console.error('Failed to acquire 2D context');
        this.spinner.hide();
      }
    }, 0);
  }

  private loadMrDueStatistics(): void {
    this.spinner.show();
    this.demandeService.getMrDueByMonth().subscribe({
        next: (data: any[]) => {
            const months = data.map(item => {
                const [year, month] = item.mois.split('-');
                return this.getMonthName(parseInt(month)) + ' ' + year;
            });

            const amounts = data.map(item =>
                typeof item.montantTotalDu === 'number' ? Math.round(item.montantTotalDu) : 0
            );

            if (this.mrDueChart) {
                this.mrDueChart.destroy();
            }

            const ctx = document.getElementById('mrDueChart') as HTMLCanvasElement;
            const gradientFill = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
            gradientFill.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
            gradientFill.addColorStop(1, 'rgba(99, 102, 241, 0.1)');

            this.mrDueChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Montant Total',
                        data: amounts,
                        fill: true,
                        backgroundColor: gradientFill,
                        borderColor: 'rgb(99, 102, 241)',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: 'rgb(99, 102, 241)',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false,
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 7,
                                font: { size: 12 },
                            },
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => {
                                    return new Intl.NumberFormat('fr-FR', {
                                        style: 'currency',
                                        currency: 'MGA',
                                        minimumFractionDigits: 0
                                    }).format(value as number);
                                },
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const value = context.raw as number;
                                    return `Montant : ${new Intl.NumberFormat('fr-FR', {
                                        style: 'currency',
                                        currency: 'MGA',
                                        minimumFractionDigits: 0
                                    }).format(value)}`;
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Évolution des MR Due mensuels',
                            font: { size: 16 },
                        },
                    }
                }
            });

            // Adding vertical dashed line for current date
            const currentDate = new Date();
            const monthIndex = months.indexOf(this.getMonthName(currentDate.getMonth() + 1) + ' ' + currentDate.getFullYear());
            if (monthIndex >= 0) {
                this.mrDueChart.line.drawVerticalLine(monthIndex, {
                    color: 'rgba(0,0,0,0.5)',
                    dash: [5, 5]
                });
            }

            this.spinner.hide();
        },
        error: (error) => {
            console.error('Erreur lors du chargement des statistiques MR due:', error);
            this.spinner.hide();
        }
    });
  }

  private loadTotalDemandes(): void {
    this.spinner.show();
    this.demandeService.getTotalDemande().subscribe({
      next: (total: number) => {
        this.totalDemandes = total;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du total des demandes:', error);
        this.spinner.hide();
      }
    });
  }

  private loadDemandesTraitees(): void {
    this.spinner.show();
    this.demandeService.getDemandesTraitees().subscribe({
      next: (total: number) => {
        this.demandesTraitees = total;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes traitées:', error);
        this.spinner.hide();
      }
    });
  }

  private loadMontantTotalDu(): void {
    this.spinner.show();
    this.demandeService.getMontantTotalMajore().subscribe({
      next: (response: string) => {
        const cleanValue = response.replace(',', '.');
        const number = parseFloat(cleanValue);
        this.montantTotalDu = number.toString();
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du montant total majoré:', error);
        this.spinner.hide();
      }
    });
  }

  private loadDemandesStatsChart(): void {
    this.spinner.show();
    this.demandeService.getDemandesStats().subscribe({
      next: (data: any[]) => {
        const monthsSet = new Set(data.map(item => item.mois));
        const months = Array.from(monthsSet).sort();
        const statuts = Array.from(new Set(data.map(item => item.statut)));

        const modernColors = [
          'rgba(99, 102, 241, 0.8)',    // Indigo
          'rgba(14, 165, 233, 0.8)',    // Sky blue
          'rgba(168, 85, 247, 0.8)',    // Purple
          'rgba(236, 72, 153, 0.8)',    // Pink
          'rgba(34, 197, 94, 0.8)'      // Green
        ];

        const datasets = statuts.map((statut, index) => {
          const statData = months.map(month => {
            const entry = data.find(d => d.mois === month && d.statut === statut);
            return entry ? entry.nombreDemandes : 0;
          });

          return {
            label: statut,
            data: statData,
            backgroundColor: modernColors[index % modernColors.length],
            borderColor: modernColors[index % modernColors.length].replace('0.8', '1'),
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
            hoverBackgroundColor: modernColors[index % modernColors.length].replace('0.8', '0.9'),
            hoverBorderColor: modernColors[index % modernColors.length].replace('0.8', '1'),
            barThickness: 25,
            maxBarThickness: 30
          };
        });

        if (this.demandesStatsChart) {
          this.demandesStatsChart.destroy();
        }

        this.demandesStatsChart = new Chart('demandesStatsChart', {
          type: 'bar',
          data: {
            labels: months.map(month => {
              const [year, monthNum] = month.split('-');
              return `${this.getMonthName(parseInt(monthNum))} ${year}`;
            }),
            datasets: datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 20,
                right: 25,
                bottom: 20,
                left: 25
              }
            },
            scales: {
              x: {
                stacked: true,
                grid: {
                  display: false,
                  drawBorder: false
                },
                // Suppression de la propriété border
                ticks: {
                  font: {
                    size: 12,
                    family: "'Inter', sans-serif",
                    weight: '500'
                  },
                  color: '#64748b',
                  padding: 12,
                  maxRotation: 45,
                  minRotation: 45
                }
              },
              y: {
                stacked: true,
                grid: {
                  color: 'rgba(148, 163, 184, 0.1)',
                  drawBorder: false,
                  lineWidth: 1
                },
                // Suppression de la propriété border
                ticks: {
                  font: {
                    size: 12,
                    family: "'Inter', sans-serif",
                    weight: '500'
                  },
                  color: '#64748b',
                  padding: 12,
                  callback: function(value) {
                    return value.toLocaleString('fr-FR');
                  }
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
                align: 'center',
                labels: {
                  padding: 20,
                  boxWidth: 10,
                  boxHeight: 10,
                  usePointStyle: true,
                  pointStyle: 'circle',
                  font: {
                    family: "'Inter', sans-serif",
                    size: 12,
                    weight: '500'
                  },
                  color: '#475569'
                }
              },
              title: {
                display: true,
                text: 'Évolution des Demandes par État',
                color: '#1e293b',
                font: {
                  size: 18,
                  family: "'Inter', sans-serif",
                  weight: '600'
                },
                padding: {
                  top: 25,
                  bottom: 25
                }
              },
              tooltip: {
                enabled: true,
                backgroundColor: '#ffffff',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 16,
                boxPadding: 8,
                usePointStyle: true,
                titleFont: {
                  size: 14,
                  family: "'Inter', sans-serif",
                  weight: '600'
                },
                bodyFont: {
                  size: 13,
                  family: "'Inter', sans-serif"
                },
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y.toLocaleString('fr-FR')} demandes`;
                  }
                }
              }
            }
          }
        });
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.spinner.hide();
      }
    });
  }

  private loadDemandesEnAttente(): void {
    this.spinner.show();
    this.demandeService.getDemandesEnAttente().subscribe({
      next: (total: number) => {
        this.demandesEnAttente = total;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes en attente:', error);
        this.spinner.hide();
      }
    });
  }

  private getRandomColor(opacity: number = 0.7): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
    const lightness = Math.floor(Math.random() * 20) + 40;  // 40-60%
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
  }

  private getRandomColors(count: number): string[] {
    return Array.from({ length: count }, () => this.getRandomColor());
  }

  private getMonthName(monthNumber: number): string {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[monthNumber - 1];
  }

  private loadMontantParEmployeur(): void {
    this.spinner.show();
    this.demandeService.getMontantTotalParEmployeur().subscribe({
      next: (data: any[]) => {
        if (!data || data.length === 0) {
          console.warn('Aucune donnée reçue');
          this.spinner.hide();
          return;
        }

        const labels = data.map(item => item.labels);
        const montantsPayes = data.map(item => item.montantTotalPaye);
        const montantsRestants = data.map(item =>
          Math.max(0, item.montantTotalDu - item.montantTotalPaye)
        );

        console.log('Labels:', labels);
        console.log('Montants Payés:', montantsPayes);
        console.log('Montants Restants:', montantsRestants);

        const ctx = document.getElementById('montantEmployeurCanvas') as HTMLCanvasElement;

        const paidColor = {
          main: 'rgba(34, 197, 94, 0.85)',
          light: 'rgba(34, 197, 94, 0.65)',
          border: 'rgba(34, 197, 94, 1)'
        };

        const remainingColor = {
          main: 'rgba(244, 63, 94, 0.85)',
          light: 'rgba(244, 63, 94, 0.65)',
          border: 'rgba(244, 63, 94, 1)'
        };

        const montantChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Montant Majore',
                data: montantsPayes,
                backgroundColor: paidColor.main,
                borderColor: paidColor.border,
                borderWidth: 1,
                borderRadius: 6,
                barThickness: 20,
                hoverBackgroundColor: paidColor.border
              },
              {
                label: 'Montant Non majore',
                data: montantsRestants,
                backgroundColor: remainingColor.main,
                borderColor: remainingColor.border,
                borderWidth: 1,
                borderRadius: 6,
                barThickness: 20,
                hoverBackgroundColor: remainingColor.border
              }
            ]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 20,
                right: 25,
                bottom: 20,
                left: 25
              }
            },
            scales: {
              x: {
                type: 'logarithmic', // Utilisation d'une échelle logarithmique
                stacked: true,
                grid: {
                  color: 'rgba(148, 163, 184, 0.1)',
                  drawBorder: false,
                  lineWidth: 1
                },
                ticks: {
                  callback: (value) => value.toLocaleString('fr-FR') + ' Ar',
                  font: {
                    family: "'Inter', sans-serif",
                    size: 11,
                    weight: '500'
                  },
                  color: '#64748b',
                  padding: 10,
                  maxTicksLimit: 6
                }
              },
              y: {
                stacked: true,
                grid: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  font: {
                    family: "'Inter', sans-serif",
                    size: 12,
                    weight: '500'
                  },
                  color: '#475569',
                  padding: 12
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
                align: 'end',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'rectRounded',
                  padding: 20,
                  color: '#475569',
                  font: {
                    family: "'Inter', sans-serif",
                    size: 12,
                    weight: '600'
                  }
                }
              },
              title: {
                display: true,
                text: 'Suivi des Demandes par Employeur',
                color: '#0f172a',
                font: {
                  family: "'Inter', sans-serif",
                  size: 16,
                  weight: '600'
                },
                padding: {
                  top: 20,
                  bottom: 20
                }
              },
              tooltip: {
                backgroundColor: '#ffffff',
                titleColor: '#0f172a',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                boxWidth: 8,
                boxHeight: 8,
                usePointStyle: true,
                titleFont: {
                  family: "'Inter', sans-serif",
                  size: 13,
                  weight: '600'
                },
                bodyFont: {
                  family: "'Inter', sans-serif",
                  size: 12
                },
                callbacks: {
                  title: (tooltipItems) => {
                    return tooltipItems[0].label;
                  },
                  label: (context) => {
                    const value = context.raw as number;
                    const total = data[context.dataIndex].montantTotalDu;
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${context.dataset.label}: ${value.toLocaleString('fr-FR')} Ar (${percentage}%)`;
                  }
                }
              }
            },
            animation: {
              duration: 1000,
              easing: 'easeInOutQuart'
            }
          }
        });
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des montants par employeur:', error);
        this.spinner.hide();
      }
    });
  }


  private loadDemandesByMotifChart(): void {
    this.spinner.show();
    this.demandeService.getDemandeByMotif().subscribe({
      next: (data: any[]) => {
        const labels = data.map(item => item.motif);
        const values = data.map(item => item.nombreDemandes);
        const colors = this.getRandomColors(labels.length);

        if (this.demandesByMotifChart) {
          this.demandesByMotifChart.destroy();
        }

        this.demandesByMotifChart = new Chart('demandesByMotifChart', {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              data: values,
              backgroundColor: colors,
              hoverBackgroundColor: colors.map(color => color.replace('0.7', '0.9'))
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'right', // Position de la légende à droite
                labels: {
                  boxWidth: 20, // Ajuster la taille des boîtes de légende
                  padding: 20 // Espacement entre les éléments de la légende
                }
              },
              title: {
                display: true,
                text: 'Répartition des demandes par motif',
                padding: {
                  top: 2,
                  bottom: 30
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.label}: ${context.raw}`;
                  }
                }
              }
            }
          }
        });
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes par motif:', error);
        this.spinner.hide();
      }
    });
  }

  private loadDemandesByPeriodeChart(): void {
    this.spinner.show();
    this.demandeService.getDemandesByPeriode().subscribe({
      next: (data: any[]) => {
        const labels = data.map(item => item.periode);
        const values = data.map(item => item.totalDemandes);

        const ctx = document.getElementById('demandesByPeriodeCanvas') as HTMLCanvasElement;
        const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0.01)');

        if (this.demandesByPeriodeChart) {
          this.demandesByPeriodeChart.destroy();
        }

        this.demandesByPeriodeChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Total Demandes',
              data: values,
              backgroundColor: gradient,
              borderColor: 'rgb(56, 189, 248)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 2,
              pointBackgroundColor: '#fff',
              pointBorderColor: 'rgb(56, 189, 248)',
              pointBorderWidth: 2,
              pointHoverRadius: 8,
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(56, 189, 248)',
              pointHoverBorderWidth: 3,
              pointStyle: 'circle',
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: 'index',
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(148, 163, 184, 0.1)',
                  drawBorder: false,
                  lineWidth: 1,
                  borderDash: [],
                  borderDashOffset: 0
                },
                ticks: {
                  font: {
                    family: "'Inter', sans-serif",
                    size: 12,
                    weight: '500'
                  },
                  padding: 12,
                  color: '#64748b'
                },
                title: {
                  display: true,
                  text: 'Nombre de Demandes',
                  color: '#475569',
                  font: {
                    family: "'Inter', sans-serif",
                    size: 13,
                    weight: '600'
                  },
                  padding: {
                    bottom: 10
                  }
                }
              },
              x: {
                grid: {
                  display: false,
                  drawBorder: false,
                  borderDash: [],
                  borderDashOffset: 0
                },
                ticks: {
                  font: {
                    family: "'Inter', sans-serif",
                    size: 12,
                    weight: '500'
                  },
                  padding: 12,
                  color: '#64748b',
                  maxRotation: 45,
                  minRotation: 45
                },
                title: {
                  display: true,
                  text: 'Période',
                  color: '#475569',
                  font: {
                    family: "'Inter', sans-serif",
                    size: 13,
                    weight: '600'
                  },
                  padding: {
                    top: 10
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 20,
                  boxWidth: 8,
                  boxHeight: 8,
                  color: '#475569',
                  font: {
                    family: "'Inter', sans-serif",
                    size: 12,
                    weight: '500'
                  }
                }
              },
              title: {
                display: true,
                text: 'Évolution des Demandes par Période',
                color: '#1e293b',
                font: {
                  family: "'Inter', sans-serif",
                  size: 16,
                  weight: '600'
                },
                padding: {
                  top: 25,
                  bottom: 25
                }
              },
              tooltip: {
                enabled: true,
                backgroundColor: '#ffffff',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                titleFont: {
                  family: "'Inter', sans-serif",
                  size: 13,
                  weight: '600'
                },
                bodyFont: {
                  family: "'Inter', sans-serif",
                  size: 12
                },
                padding: 12,
                borderColor: '#e2e8f0',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                  label: function(context) {
                    return `${context.parsed.y} demandes`;
                  }
                }
              }
            }
          }
        });
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes par période:', error);
        this.spinner.hide();
      }
    });
  }

  private loadDemandesByEmployeurChart(): void {
    this.spinner.show();
    this.demandeService.getDemandesByEmployeur().subscribe({
      next: (data: any[]) => {
        const labels = data.map(item => item.employeurNom);
        const values = data.map(item => item.nombreDemandes);

        const ctx = document.getElementById('demandesByEmployeurCanvas') as HTMLCanvasElement;

        // Palette de couleurs harmonieuses respectant les normes UI/UX
        const colors = [
          '#3b82f6', // Blue
          '#8b5cf6', // Purple
          '#06b6d4', // Cyan
          '#10b981', // Emerald
          '#f59e0b', // Amber
          '#6366f1', // Indigo
          '#ec4899', // Pink
          '#14b8a6', // Teal
          '#f97316', // Orange
          '#8b5cf6'  // Purple
        ];

        if (this.demandesByEmployeurChart) {
          this.demandesByEmployeurChart.destroy();
        }

        this.demandesByEmployeurChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Nombre de Demandes',
              data: values,
              backgroundColor: colors,
              borderColor: colors,
              borderWidth: 1,
              borderRadius: 6,
              barThickness: 32,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(148, 163, 184, 0.1)',
                  drawBorder: false,
                  lineWidth: 1
                },
                ticks: {
                  font: {
                    size: 12,
                    family: "'Inter', sans-serif"
                  },
                  color: '#64748b',
                  padding: 10
                },
                title: {
                  display: true,
                  text: 'Nombre de Demandes',
                  color: '#475569',
                  font: {
                    size: 13,
                    family: "'Inter', sans-serif",
                    weight: '600'
                  }
                }
              },
              x: {
                grid: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  font: {
                    size: 12,
                    family: "'Inter', sans-serif"
                  },
                  color: '#64748b',
                  padding: 10
                },
                title: {
                  display: true,
                  text: 'Employeur',
                  color: '#475569',
                  font: {
                    size: 13,
                    family: "'Inter', sans-serif",
                    weight: '600'
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'Distribution des Demandes par Employeur',
                color: '#1e293b',
                font: {
                  size: 16,
                  family: "'Inter', sans-serif",
                  weight: '600'
                },
                padding: {
                  top: 25,
                  bottom: 25
                }
              },
              tooltip: {
                backgroundColor: '#ffffff',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 6,
                titleFont: {
                  size: 13,
                  family: "'Inter', sans-serif",
                  weight: '600'
                },
                bodyFont: {
                  size: 12,
                  family: "'Inter', sans-serif"
                },
                displayColors: true,
                boxWidth: 8,
                boxHeight: 8,
                boxPadding: 4,
                usePointStyle: true,
                callbacks: {
                  label: function(context) {
                    return `${context.parsed.y} demandes`;
                  }
                }
              }
            }
          }
        });
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes par employeur:', error);
        this.spinner.hide();
      }
    });
  }

}
