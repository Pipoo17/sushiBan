import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  private isProd = true

  private supabaseUrl = '';
  private supabaseKey = '';


  constructor() {  
    this.setDatabaseConnection(this.isProd) 

  }




  setDatabaseConnection(isProd:boolean) {
    if(isProd){ //prod
      this.supabaseUrl = 'https://prlpyuqxpcxsxcirxizc.supabase.co';
      this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBybHB5dXF4cGN4c3hjaXJ4aXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ5ODE1MjEsImV4cCI6MjAyMDU1NzUyMX0.uNfnIV453U_kSFl4SaLy5ehvpyPpxe6jKA5LYw7pRmQ';
    }
    else{ //test
      this.supabaseUrl = 'https://lcitxbybmixksqmlyyzb.supabase.co';
      this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaXR4YnlibWl4a3NxbWx5eXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTczMDA0MTksImV4cCI6MjAxMjg3NjQxOX0.Gr20DaBG56cYTTuPF_pceqvA8lpiG4D-bizhqBRDf2o';
    }
  }

  getSupabaseUrl(){
    return this.supabaseUrl 
  }

  getSupabaseKey(){
    return this.supabaseKey 
  }

}
