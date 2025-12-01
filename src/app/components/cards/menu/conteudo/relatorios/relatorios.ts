import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

interface Dashboard {
  titulo: string;
  url: SafeResourceUrl;
}

@Component({
  selector: 'app-relatorios',
  imports: [CommonModule],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.css'
})
export class Relatorios {
  public dashboards: Dashboard[] = [];

  private dashboardUrls = [
    {
      titulo: 'Categorias Mais Lidas',
      url: 'http://localhost:3000/d-solo/df5pxhdp4itxcc/categorias-mais-lidas?orgId=1&from=now-24h&to=now&theme=light&panelId=1'
    },
    {
      titulo: 'Devoluções Atrasadas por Mês',
      url: 'http://localhost:3000/d-solo/bf5q4ykx3lds0c/devolucoes-atrasadas-por-mes?orgId=1&from=now-24h&to=now&theme=light&panelId=1'
    },
    {
      titulo: 'Empréstimos por Mês',
      url: 'http://localhost:3000/d-solo/af5pwlij19l34b/emprestimos-por-mes?orgId=1&from=now-24h&to=now&theme=light&panelId=1'
    },
    {
      titulo: 'Livros Mais Emprestados',
      url: 'http://localhost:3000/d-solo/cf5q0sgmjmewwc/livros-mais-emprestados?orgId=1&from=now-24h&to=now&theme=light&panelId=1'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {
    this.dashboards = this.dashboardUrls.map(dash => ({
      titulo: dash.titulo,
      url: this.sanitizer.bypassSecurityTrustResourceUrl(dash.url)
    }));
  }

  public abrirGrafana(): void {
    window.open('http://localhost:3000/dashboards', '_blank');
  }
}
