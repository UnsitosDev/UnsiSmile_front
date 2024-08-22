import { Component, AfterViewInit } from '@angular/core';

declare const $: any;

@Component({
  standalone: true,
  selector: 'app-bootstrap-table',
  templateUrl: './bootstrap-table.component.html',
  styleUrls: ['./bootstrap-table.component.scss']
})
export class BootstrapTableComponent implements AfterViewInit {

  constructor() {}

  ngAfterViewInit(): void {
    this.initTable();
    $('#locale').change(() => this.initTable());
  }

  initTable(): void {
    const $table = $('#table');
    const $remove = $('#remove');
    let selections: any[] = [];

    function getIdSelections() {
      return $.map($table.bootstrapTable('getSelections'), function (row: any) {
        return row.id;
      });
    }

    function responseHandler(res: any) {
      $.each(res.rows, function (i: any, row: { state: boolean; id: any; }) {
        row.state = $.inArray(row.id, selections) !== -1;
      });
      return res;
    }

    function detailFormatter(index: number, row: any) {
      const html: string[] = [];
      $.each(row, function (key: any, value: any) {
        html.push('<p><b>' + key + ':</b> ' + value + '</p>');
      });
      return html.join('');
    }

    function operateFormatter(value: any, row: any, index: any) {
      return [
        '<a class="like" href="javascript:void(0)" title="Like">',
        '<i class="fa fa-heart"></i>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<i class="fa fa-trash"></i>',
        '</a>'
      ].join('');
    }

    const operateEvents = {
      'click .like': function (e: any, value: any, row: any, index: any) {
        alert('You click like action, row: ' + JSON.stringify(row));
      },
      'click .remove': function (e: any, value: any, row: any, index: any) {
        $table.bootstrapTable('remove', {
          field: 'id',
          values: [row.id]
        });
      }
    };

    function totalTextFormatter(data: any) {
      return 'Total';
    }

    function totalNameFormatter(data: any) {
      return data.length;
    }

    function totalPriceFormatter(this: { field: string; title: string; sortable: boolean; align: string; footerFormatter: (data: any) => string; }, data: any) {
      const field = this.field;
      return '$' + data.map(function (row: any) {
        return +row[field].substring(1);
      }).reduce(function (sum: any, i: any) {
        return sum + i;
      }, 0);
    }

    $table.bootstrapTable('destroy').bootstrapTable({
      height: 550,
      locale: $('#locale').val(),
      columns: [
        [
          {
            field: 'state',
            checkbox: true,
            rowspan: 2,
            align: 'center',
            valign: 'middle'
          },
          {
            title: 'Item ID',
            field: 'id',
            rowspan: 2,
            align: 'center',
            valign: 'middle',
            sortable: true,
            footerFormatter: totalTextFormatter
          },
          {
            title: 'Item Detail',
            colspan: 3,
            align: 'center'
          }
        ],
        [
          {
            field: 'name',
            title: 'Item Name',
            sortable: true,
            footerFormatter: totalNameFormatter,
            align: 'center'
          },
          {
            field: 'price',
            title: 'Item Price',
            sortable: true,
            align: 'center',
            footerFormatter: totalPriceFormatter
          },
          {
            field: 'operate',
            title: 'Item Operate',
            align: 'center',
            clickToSelect: false,
            events: operateEvents,
            formatter: operateFormatter
          }
        ]
      ]
    });

    $table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
      $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);
      selections = getIdSelections();
    });

    $remove.click(function () {
      const ids = getIdSelections();
      $table.bootstrapTable('remove', {
        field: 'id',
        values: ids
      });
      $remove.prop('disabled', true);
    });
  }
}
