import ExcelJS from "exceljs"
import {saveAs} from 'file-saver'
import {isEmpty} from 'lodash'

export default class ExcelHelpers {
    static read(file) {
        return new Promise(function (resolve) {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                const workbook = new ExcelJS.Workbook();
                const buffer = e.target.result;

                return workbook.xlsx.load(buffer).then((wb) => {
                    const data = []
                    workbook.eachSheet((sheet, id) => {
                        sheet.eachRow((row, rowIndex) => {
                            data[rowIndex] = row.values
                        })
                    })

                    resolve(data);
                }).catch((error) => {
                    console.log("readFile fail", error);
                })
            };
            fileReader.readAsArrayBuffer(file)
        })
    }

    static load(file, callback){
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file)
        return fileReader.onload = (e) => {
            const workbook = new ExcelJS.Workbook();
            const buffer = e.target.result;

            return workbook.xlsx.load(buffer).then((wb) => {
                if (callback instanceof Function) {
                    callback(wb)
                }
            }).catch((error) => {
                console.log("load file fail", error);
            })
        };

    }

    static async saveAsExcel(wb, fileName = 'SavedExcel.xlsx') {
        const buf = await wb.xlsx.writeBuffer()
        saveAs(new Blob([buf]), fileName)
    }

    static async saveAsExcelFromList(items = [], callback, fileName = 'SavedExcel.xlsx') {
        if (!isEmpty(items)) {
            const wb = new ExcelJS.Workbook()
            const ws = wb.addWorksheet()

            items.forEach((item, index) => {

                if (callback instanceof Function) {
                    callback(ws, item, index)
                }
            })

            this.saveAsExcel(wb, fileName).catch(e => console.log(e))
        }
    }
}
