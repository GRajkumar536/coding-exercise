import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Model } from './Model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isGrid = true;
  isEdit = false;
  model = new Model();
  selectedFile: File
  imagePath;
  message: string;
  displayedColumns: string[] = ['checkBos', 'itemName', 'itemPrice', 'itemDescription', 'itemAdditionDate', 'itemImage', 'actions'];
  dataSource = new MatTableDataSource(items);
  selection = new SelectionModel(true, []);
  data = Object.assign(items);

  constructor(private elementRef: ElementRef, public dialog: MatDialog) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'rgba(164, 166, 164, 0.38)';
  }

  SaveItem(item, form) {
    var count = 0;
    if (!item.itemId)
      item.itemId = items.length + 1;
    if (this.isEdit) {
      items.forEach(record => {
        if (record.itemId == item.itemId) {
          items[count] = item;
          count = 0;
          this.isEdit = false;
          return
        }
        count = count + 1;
      });
    }
    else {
      this.isEdit = false;
      items.splice(0, 0, item);
      this.dataSource = new MatTableDataSource(items);
    }
    this.model = new Model();
    let dialogRef = this.dialog.open(DialogComponent, { data: { isDelete: false } });
    this.dataSource.paginator = this.paginator;
  }

  Edit(item) {
    this.isEdit = true;
    this.isGrid = true;
    this.model = item;
  }

  Delete(id) {
    let dialogRef = this.dialog.open(DialogComponent, { data: { isDelete: true } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "true") {
        var count = 0;
        items.forEach((record, index) => {
          if (record.itemId == id) {
            items.splice(index, 1);
            this.dataSource = new MatTableDataSource(items);
            return false;
          }
          count = count + 1;
        });
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  imgPreview(files) {
    if (files.length === 0)
      return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.model.itemImage = reader.result;
    }
  }

  filter(filteredText) {
    this.dataSource.filter = filteredText.trim().toLowerCase();
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  removeSelectedRows() {
    this.selection.selected.forEach(item => {
      let index: number = this.data.findIndex(d => d === item);
      console.log(this.data.findIndex(d => d === item));
      this.dataSource.data.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    });
    this.selection = new SelectionModel(true, []);
    this.dataSource.paginator = this.paginator;
  }
}

const items = [
  { itemId: 1, itemName: "abc", itemImage: "/assets/images/test3.jpg", itemPrice: "100", itemDescription: "Description", itemAdditionDate: "2/16/1997" },
  { itemId: 2, itemName: "def", itemImage: "/assets/images/unnamed.gif", itemPrice: "200", itemDescription: "Description", itemAdditionDate: "1/15/1997" },
  { itemId: 3, itemName: "ghi", itemImage: "/assets/images/test2.jpg", itemPrice: "300", itemDescription: "Description", itemAdditionDate: "3/13/1997" },
  { itemId: 4, itemName: "jkl", itemImage: "/assets/images/test4.jpg", itemPrice: "400", itemDescription: "Description", itemAdditionDate: "3/13/1997" },
  { itemId: 5, itemName: "mno", itemImage: "/assets/images/test5.png", itemPrice: "500", itemDescription: "Description", itemAdditionDate: "3/13/1997" }
];