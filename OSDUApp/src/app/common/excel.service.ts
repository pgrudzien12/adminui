import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private headers = [
    '#',
    'Group Name',
    'Product Family',
    'IBX',
    'POF Qty',
    'POF',
    'POE',
    'Attributes',
    'POE Qty',
    'Sls Qty',
  ];

  DATA_EXAMPLE = [
    {
      group_name: 'GROUP 1',
      product_family: 'Product family X',
      ibx: 'IBX 1',
      products: [
        {
          quantity: 5,
          product_name: 'Product A',
          elements: [
            {
              element_name: 'Element M',
              description: 'Some description',
              quantity: 2,
              sales_quantity: 0,
            },
            {
              element_name: 'Element N',
              description: 'Some description',
              quantity: 1,
              sales_quantity: 0,
            },
          ],
        },
        {
          quantity: 2,
          product_name: 'Product B',
          elements: [
            {
              element_name: 'Element J',
              description: 'Some description',
              quantity: 1,
              sales_quantity: 2,
            },
            {
              element_name: 'Element K',
              description: 'Some description',
              quantity: 1,
              sales_quantity: 0,
            },
            {
              element_name: 'Element L',
              description: 'Some description',
              quantity: 1,
              sales_quantity: 0,
            },
          ],
        },
      ],
    },
    {
      group_name: 'GROUP 2',
      product_family: 'Product family Y',
      ibx: 'IBX 2',
      products: [
        {
          quantity: 5,
          product_name: 'Product AZ',
          elements: [
            {
              element_name: 'Element A',
              description: 'Some description',
              quantity: 2,
              sales_quantity: 0,
            },
            {
              element_name: 'Element B',
              description: 'Some description',
              quantity: 1,
              sales_quantity: 0,
            },
          ],
        },
      ],
    },
  ];

  constructor() {}

  generateExcel() {
    //Excel Title, Header, Data
    const title = 'Car Sell Report';
    const header = ['Year', 'Month', 'Make', 'Model', 'Quantity', 'Pct'];
    const data = [
      [2007, 1, 'Volkswagen ', 'Volkswagen Passat', 1267, 10],
      [2007, 1, 'Toyota ', 'Toyota Rav4', 819, 6.5],
      [2007, 1, 'Toyota ', 'Toyota Avensis', 787, 6.2],
      [2007, 1, 'Volkswagen ', 'Volkswagen Golf', 720, 5.7],
      [2007, 1, 'Toyota ', 'Toyota Corolla', 691, 5.4],
      [2007, 1, 'Peugeot ', 'Peugeot 307', 481, 3.8],
      [2008, 1, 'Toyota ', 'Toyota Prius', 217, 2.2],
      [2008, 1, 'Skoda ', 'Skoda Octavia', 216, 2.2],
      [2008, 1, 'Peugeot ', 'Peugeot 308', 135, 1.4],
      [2008, 2, 'Ford ', 'Ford Mondeo', 624, 5.9],
      [2008, 2, 'Volkswagen ', 'Volkswagen Passat', 551, 5.2],
      [2008, 2, 'Volkswagen ', 'Volkswagen Golf', 488, 4.6],
      [2008, 2, 'Volvo ', 'Volvo V70', 392, 3.7],
      [2008, 2, 'Toyota ', 'Toyota Auris', 342, 3.2],
      [2008, 2, 'Volkswagen ', 'Volkswagen Tiguan', 340, 3.2],
      [2008, 2, 'Toyota ', 'Toyota Avensis', 315, 3],
      [2008, 2, 'Nissan ', 'Nissan Qashqai', 272, 2.6],
      [2008, 2, 'Nissan ', 'Nissan X-Trail', 271, 2.6],
      [2008, 2, 'Mitsubishi ', 'Mitsubishi Outlander', 257, 2.4],
      [2008, 2, 'Toyota ', 'Toyota Rav4', 250, 2.4],
      [2008, 2, 'Ford ', 'Ford Focus', 235, 2.2],
      [2008, 2, 'Skoda ', 'Skoda Octavia', 225, 2.1],
      [2008, 2, 'Toyota ', 'Toyota Yaris', 222, 2.1],
      [2008, 2, 'Honda ', 'Honda CR-V', 219, 2.1],
      [2008, 2, 'Audi ', 'Audi A4', 200, 1.9],
      [2008, 2, 'BMW ', 'BMW 3-serie', 184, 1.7],
      [2008, 2, 'Toyota ', 'Toyota Prius', 165, 1.6],
      [2008, 2, 'Peugeot ', 'Peugeot 207', 144, 1.4],
    ];
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Car Data');
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = {
      name: 'Comic Sans MS',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    worksheet.addRow([]);

    worksheet.mergeCells('A1:D2');
    //Blank Row
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    data.forEach((d) => {
      let row = worksheet.addRow(d);
      let qty = row.getCell(5);
      let color = 'FF99FF99';
      if (+qty.value < 500) {
        color = 'FF9999';
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      };
    });
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.addRow([]);
    //Footer Row
    let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCFFE5' },
    };
    footerRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'CarData.xlsx');
    });
  }

  public exportToExcelSearch(headers, data) {
    // create a workbook with a worksheet
    const workbook = new Workbook();

    workbook.creator = 'Our Team';
    workbook.created = new Date(Date.now());

    const worksheet = workbook.addWorksheet('sheet1');

    // Adding Header Row
    worksheet.addRow(headers).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    let tempHead = [];
    headers.forEach((element) => {
      if (element == 'Id') {
        tempHead.push('.Id');
      } else if (element == 'Legal Tag') {
        tempHead.push('..Legal Tag');
      } else {
        tempHead.push(element);
      }
    });
    // Adding legal Data
    for (let i = 0; i < data.length; i++) {
      let temp = [];
      for (let j = 0; j < tempHead.length; j++) {
        temp.push(data[i][tempHead[j]]);
      }
      worksheet.addRow(temp);
    }

    // Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'SearchData' + '.xlsx');
    });
  }

  public exportToExcel(headers, subHeaders, data): void {
    // Here I’m trying to calculate how many lines I need to merge into the group lines

    // create a workbook with a worksheet
    const workbook = new Workbook();

    workbook.creator = 'Our Team';
    workbook.created = new Date(Date.now());

    const worksheet = workbook.addWorksheet('sheet1');

    // Adding Header Row
    worksheet.addRow(headers).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    const subHeader = [];
    for (let i = 0; i < subHeaders.length; i++) {
      subHeader[i + 3] = subHeaders[i];
    }
    worksheet.addRow(subHeader).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.mergeCells('C1:J1');
    worksheet.mergeCells('A1:A2');
    worksheet.mergeCells('B1:B2');
    // Adding legal Data
    data.forEach((legal) => {
      worksheet.addRow([
        legal.name,
        legal.description,
        legal['properties']['countryOfOrigin'],
        legal['properties']['contractId'],
        legal['properties']['expirationDate'],
        legal['properties']['originator'],
        legal['properties']['dataType'],
        legal['properties']['securityClassification'],
        legal['properties']['personalData'],
        legal['properties']['exportClassification'],
      ]);
    });

    // Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'LegalTagList' + '.xlsx');
    });
  }
}
