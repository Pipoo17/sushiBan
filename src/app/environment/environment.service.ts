import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  isProd = false;

  constructor() { }
  supabaseProd = {
    url: 'TODO',
    key: 'TODO'
  }
  
  supabaseTest = {
    url: 'https://wzlpmcsxrxogtctlznel.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNTA4NjA1MCwiZXhwIjoxOTUwNjYyMDUwfQ.CzFuYS6XKvEwW5OsAAPAcHvuo-NVE4PUwDSKgqK9Yas'
  }

  getSupabaseParams(){
    if(this.isProd){
      return this.supabaseProd 
      }
      return this.supabaseTest 

    }

  }

