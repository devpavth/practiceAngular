import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  preferences = {
    theme: '',
    language: ''
  };

  preferencesList: any[] = [];

  ngOnInit(){
    const storedPreferences = localStorage.getItem('preferences');
    if(storedPreferences){
      const parsedPreferences = JSON.parse(storedPreferences);
      this.preferencesList = Array.isArray(parsedPreferences) ? parsedPreferences : [parsedPreferences];
      console.log("initial loading: ",this.preferencesList)
    }else{
      this.preferencesList = [];
    }
  }

  savePreferences(){
    console.log("current preferenceList:", this.preferencesList);
    if(Array.isArray(this.preferencesList)){
      this.preferencesList.push({...this.preferences});
      console.log("saved preferences:", this.preferencesList);
    }

    localStorage.setItem('preferences', JSON.stringify(this.preferencesList));
  }

}
