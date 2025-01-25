import { Injectable } from '@angular/core';
import { Student } from '../../Models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor() { }

  students: Student[] = [
    new Student(1, 'John Smith', 'Male', new Date('11-12-1997'), 'MBA', 520, 1899),
    new Student(2, 'Ariprakash', 'Male', new Date('10-06-1998'), "MCA", 570, 2899),
    new Student(3, "Mythili", 'Female', new Date('10-12-1999'), "B.Tech", 590, 1899),
    new Student(4, "Pavithra", 'Female', new Date('11-11-2000'), "BCA", 450, 799),
    new Student(5, "Geetha", 'Female', new Date('7-08-1995'), "M.Sc", 490, 2899),
    new Student(6, "Grace", 'Female', new Date('06-12-1996'), "B.Tech", 320, 799),
  ];

  totalMarks: number = 600;

  CreateStudent(name: string, gender: string, dob: Date, course: string, marks: number, fee: number){
    let id = this.students.length + 1;
    let student = new Student(id, name, gender, dob, course, marks, fee);
    this.students.push(student);
  }

  filterStudentByGender(filterBy: string){
    if(filterBy.toLowerCase() === 'all' || filterBy === '' || this.students.length === 0){
        return this.students;
    }else{
        return this.students.filter(
          (std) => {
            return std.gender.toLowerCase() === filterBy.toLowerCase();
          }
        )
    }
  }
  
}
