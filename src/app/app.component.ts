import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Model } from './Model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isGrid = true;
  isEdit = false;
  model = new Model();
  imagePath;
  message: string;
  displayedColumns: string[] = ['checkBos', 'itemName', 'itemPrice', 'itemDescription', 'itemAdditionDate', 'itemImage', 'actions'];
  dataSource = new MatTableDataSource(items);
  selection = new SelectionModel(true, []);
  isLocalstorage;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  searchText: any;

  constructor(private elementRef: ElementRef, public dialog: MatDialog) { }

  ngOnInit() {
    this.isLocalstorage = localStorage.getItem("ISLOCALSTORAGE");
    if (this.isLocalstorage == "true") {
      items = JSON.parse(localStorage.getItem("ITEMS"));
      this.dataSource = new MatTableDataSource(items);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'rgba(164, 166, 164, 0.38)';
  }

  SaveItem(item, form) {
    var count = 0;
    this.searchText = null;
    this.isLocalstorage = localStorage.getItem("ISLOCALSTORAGE");
    if (this.isLocalstorage == "true")
      items = JSON.parse(localStorage.getItem("ITEMS"));
    if (!item.itemId) {
      var firstItem = items[0];
      item.itemId = firstItem?.itemId >= 0 ? firstItem.itemId + 1 : 1;
    }
    if (this.isEdit) {
      items.forEach(record => {
        if (record.itemId == item.itemId) {
          items[count] = item;
          this.dataSource = new MatTableDataSource(items);
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
      localStorage.setItem("ISLOCALSTORAGE", "true");
      localStorage.setItem("ITEMS", JSON.stringify(items));
      items = JSON.parse(localStorage.getItem("ITEMS"));
      this.dataSource = new MatTableDataSource(items);
    }
    this.model = new Model();
    localStorage.setItem("ISLOCALSTORAGE", "true");
    localStorage.setItem("ITEMS", JSON.stringify(items));
    let dialogRef = this.dialog.open(DialogComponent, { data: { isDelete: false } });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  Edit(item) {
    this.searchText = null;
    this.isEdit = true;
    this.isGrid = true;
    this.model = JSON.parse(JSON.stringify(item));
  }

  Delete(id) {
    let dialogRef = this.dialog.open(DialogComponent, { data: { isDelete: true } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "true") {
        var count = 0;
        this.searchText = null;
        items.forEach((record, index) => {
          if (record.itemId == id) {
            items.splice(index, 1);
            this.dataSource = new MatTableDataSource(items);
            localStorage.setItem("ISLOCALSTORAGE", "true");
            localStorage.setItem("ITEMS", JSON.stringify(items));
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            return false;
          }
          count = count + 1;
        });
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
    this.dataSource.filter = this.searchText.trim().toLowerCase();
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
    this.selection.selected.forEach((selectedItem) => {
      this.dataSource.data.forEach((item, index) => {
        if (selectedItem.itemId == item.itemId) {
          this.dataSource.data.splice(index, 1);
          this.dataSource = new MatTableDataSource(this.dataSource.data);
        }
      });
    });
    localStorage.setItem("ISLOCALSTORAGE", "true");
    localStorage.setItem("ITEMS", JSON.stringify(items));
    this.selection = new SelectionModel(true, []);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isAddItem() {
    this.isEdit = false;
    this.model = new Model();
  }

  isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }
}

var items = [
  { itemId: 5, itemName: "abc", itemImage: "/assets/images/test3.jpg", itemPrice: "100", itemDescription: "Description", itemAdditionDate: "2020-06-30" },
  { itemId: 4, itemName: "def", itemImage: "/assets/images/unnamed.gif", itemPrice: "200", itemDescription: "Description", itemAdditionDate: "2020-06-30" },
  { itemId: 3, itemName: "ghi", itemImage: "/assets/images/test2.jpg", itemPrice: "300", itemDescription: "Description", itemAdditionDate: "2020-06-30" },
  { itemId: 2, itemName: "jkl", itemImage: "/assets/images/test4.jpg", itemPrice: "400", itemDescription: "Description", itemAdditionDate: "2020-06-30" },
  { itemId: 1, itemName: "mno", itemImage: "/assets/images/test5.png", itemPrice: "500", itemDescription: "Description", itemAdditionDate: "2020-06-30" }
];