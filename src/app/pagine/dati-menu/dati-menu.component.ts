import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/servizi/supabase.service';
import { EnvironmentService } from 'src/app/servizi/environment.service';
import { MenuService } from 'src/app/servizi/menu.service';
import { Table } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';


interface Categoria {
  codice: number;
  nome: string;
}

interface piatto {
  id: string,
  codice: string,
  nome: string,
  categoria :Categoria,
  img:{
    file: string | File
    changed: boolean
  }
}

@Component({
  selector: 'app-dati-menu',
  templateUrl: './dati-menu.component.html',
  styleUrls: ['./dati-menu.component.css']
})

export class DatiMenuComponent {
menuJson :any;
totalRecords : any;
loading: boolean = false;
categorie : any = [];

isUpdatePopUpVisible : boolean = false;

updatePiattoJson :piatto = {
  id: '',
  codice: '',
  nome: '',
  categoria: {
    codice: Number(''),
    nome: ''
  },
  img:{
    file: '',
    changed: false
  }
};

submitted: boolean = false;

filtroCategorie: Categoria[] | undefined;

//debug: boolean = true;
debug: boolean = !this.EnvironmentService.getIsProd();

  constructor(
    private supabaseService: SupabaseService,
    private servizioMenu: MenuService,
    private EnvironmentService: EnvironmentService,

  ){
    this.supabaseService.checkAuth();

  }

  async ngOnInit(){
    this.loading = true
    this.menuJson = await this.supabaseService.getPiatti()
    console.log(this.menuJson);
    
    this.categorie = this.servizioMenu.getCategorie();
    this.loading = false

    console.log(this.EnvironmentService.getIsProd());
    

    await this.getFiltroCategorieValues()

    console.log(this.menuJson);
    console.log(this.totalRecords);
    console.log(this.menuJson)

  }

  getImgPiatto(codicePiatto : string){

    return this.supabaseService.getPictureURL("immaginiPiatti",codicePiatto)
  }



  clear(table: Table) {
    table.clear();
}

openUpdate(piatto : any){
  this.isUpdatePopUpVisible = !this.isUpdatePopUpVisible

  this.updatePiattoJson = {
    id: piatto.id,
    codice: piatto.codice,
    nome: piatto.nome,
    categoria:{
      codice: Number(piatto.idcategoria),
      nome:piatto.categoria
    },
    img: {
      file: this.getImgPiatto(piatto.codice),
      changed: false
    }
  }
  //piatto;
  console.log(this.updatePiattoJson);
  
}


  //Aggiornamento foto profilo
  async onFileSelected(event: any) {
    console.log("onFileSelected");
    
    const imgPiatto = event.target.files[0]
    
    console.log(typeof imgPiatto);
    console.log(imgPiatto);

    if (imgPiatto) {

      const imageUrl = URL.createObjectURL(imgPiatto);

      this.updatePiattoJson = {
        id: this.updatePiattoJson.id,
        codice: this.updatePiattoJson.codice,
        nome: this.updatePiattoJson.nome,
        categoria:{
          codice: Number(this.updatePiattoJson.categoria.codice),
          nome:this.updatePiattoJson.categoria.nome
        },
        img: {
          file: imageUrl,
          changed: true
        }
      }
    }
  }






async getFiltroCategorieValues(){


  this.filtroCategorie = this.filtroCategorie ?? [];
  let data = await this.supabaseService.getListaCategorie();

  if(data == null) return

  data.forEach(categoria => {
    this.filtroCategorie?.push({ codice: categoria.idCategoria, nome: categoria.descrizione }) 
  });


}



update(){

  this.submitted = true;

  this.supabaseService.updatePiatto(this.updatePiattoJson)
  
}


close(){
  console.log('modifiche annullate');
  this.isUpdatePopUpVisible = false;
  this.submitted = false;
}



/* 
exportPdf() {
  import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
          const doc = new jsPDF.default('p', 'px', 'a4');
          (doc as any).autoTable(this.exportColumns, this.products);
          doc.save('products.pdf');
      });
  });
}

exportExcel() {
  import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'products');
  });
}

saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}
 */
}
