import { Component, ElementRef, OnInit, inject, ViewChild } from '@angular/core';
import { Student } from '../../../Models/student';
import { StudentService } from '../../../Services/student/student.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  studentService = inject(StudentService);

  isInserting: boolean = false;
  isEditing: boolean = false;
  stdIdToEdit: number | undefined;

  students: Student[] | undefined;
  totalMarks: number | undefined;
  filterText: string = 'All';

  @ViewChild('name') Name: ElementRef | undefined;
  @ViewChild('gender') Gender: ElementRef | undefined;
  @ViewChild('dob') Dob: ElementRef | undefined;
  @ViewChild('course') Course: ElementRef | undefined;
  @ViewChild('marks') Marks: ElementRef | undefined;
  @ViewChild('fee') Fee: ElementRef | undefined;

  @ViewChild('editName') editName: ElementRef | undefined;
  @ViewChild('editGender') editGender: ElementRef | undefined;
  @ViewChild('editDob') editDob: ElementRef | undefined;
  @ViewChild('editCourse') editCourse: ElementRef | undefined;
  @ViewChild('editMarks') editMarks: ElementRef | undefined;
  @ViewChild('editFee') editFee: ElementRef | undefined;

  ngOnInit(){
    this.students = this.studentService.filterStudentByGender(this.filterText);
    this.totalMarks = this.studentService.totalMarks;
  }

  OnFilterValueChanged(event: any){
    console.log("event:", event);
    let selectedValue = event.target.value;
    console.log("selectedValue:", selectedValue);
    this.filterText = selectedValue;
    this.students = this.studentService.filterStudentByGender(selectedValue);
  }

  OnInsertClicked(){
    console.log("clicking");
    this.isInserting = true;
  }

  OnInsertCancelled(){
    this.isInserting = false;
  }

  OnInsertSaved(){
    this.studentService.CreateStudent(
      this.Name?.nativeElement.value,
      this.Gender?.nativeElement.value,
      this.Dob?.nativeElement.value,
      this.Course?.nativeElement.value,
      this.Marks?.nativeElement.value,
      this.Fee?.nativeElement.value
    );
    this.isInserting = false;
    this.students = this.studentService.filterStudentByGender(this.filterText);
  }

  OnEditClicked(stdId: number){
    this.isEditing = true;
    this.stdIdToEdit = stdId
  }

  OnEditCancelled(){
    this.isEditing = false;
  }

  OnEditSaved(student: Student){
    student.name = this.editName?.nativeElement.value;
    console.log("this.editName?.nativeElement.value:", this.editName?.nativeElement.value);
    student.gender = this.editGender?.nativeElement.value;
    student.dob = this.editDob?.nativeElement.value;
    student.course = this.editCourse?.nativeElement.value;
    student.marks = this.editMarks?.nativeElement.value;
    student.fee = this.editFee?.nativeElement.value;

    this.isEditing = false;
    this.students = this.studentService.filterStudentByGender(this.filterText);
  }
}
