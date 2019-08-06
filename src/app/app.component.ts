import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-simple-grid-table';
  columns = COLUMN_NAMES.map(name => {
    return { label: name, id: name.toLowerCase().replace(/ /g, '-') };
  });
  values: { [column: string]: unknown }[] = VALUES;

  ngOnInit() {
    setTimeout(() => {
      this.values = VALUES2;
    }, 5000);
  }
}

const COLUMN_NAMES = ['Name', 'City', 'Age', 'Occupation', 'Favorite Language', 'Favorite Editor'];

const VALUES = [
  {
    name: 'Tamira',
    city: 'Tronto',
    age: '32',
    occupation: 'SRE',
    'favorite-language': 'Python',
    'favorite-editor': 'IntelliJ'
  },
  {
    name: 'Cray',
    city: 'Tokyo',
    age: '22',
    occupation: 'Infrastructure Engineer',
    'favorite-language': 'C++',
    'favorite-editor': 'Vim'
  },
  {
    name: 'Yuka',
    city: 'Kyoto',
    age: '37',
    occupation: 'Frontend Engineer',
    'favorite-language': 'Elm',
    'favorite-editor': 'VSCode'
  }
];

const VALUES2 = [
  {
    name: 'Tamira',
    city: 'Tronto',
    age: '32',
    occupation: 'SRE',
    'favorite-language': 'Python',
    'favorite-editor': 'IntelliJ'
  },
  {
    name: 'Cray',
    city: 'Tokyo',
    age: '22',
    occupation: 'Infrastructure Engineer',
    'favorite-language': 'C++',
    'favorite-editor': 'Vim'
  },
  {
    name: 'Yuka',
    city: 'Kyoto',
    age: '37',
    occupation: 'Frontend Engineer',
    'favorite-language': 'Elm',
    'favorite-editor': 'VSCode'
  }
];
