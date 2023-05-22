import React from 'react';
import clsx from 'clsx';
import {
  ColumnDef,
  Row,
  RowSelectionState,
  flexRender,
  useReactTable,
} from '@tanstack/react-table';

import { CityT } from '../../types';
import { defaultOptions } from './options';
import Filter from './Filter/Filter';
import styles from './Table.module.scss';
import Button from '../Button/Button';

interface TableProps {
  data: CityT[];
  onDelete: (row: Row<CityT>[]) => void;
}

const mergedInputClassname = clsx('input', styles.inputToPage);

function Table({ data, onDelete }: TableProps) {
  console.log('Table rerenders');

  const columns: ColumnDef<CityT>[] = [
    {
      id: 'delete',
      // eslint-disable-next-line react/no-unstable-nested-components
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      header: 'Название города',
      accessorKey: 'name',
    },
    {
      header: 'Регион',
      accessorKey: 'subject',
    },
    {
      header: 'Население',
      accessorKey: 'population',
    },
    {
      header: 'Координаты',
      accessorFn: ({ coords }) => `${coords.lat} ш. ${coords.lon} д.`,
    },
  ];

  const table = useReactTable<CityT>({
    data,
    columns,
    ...defaultOptions,
    enableRowSelection: true,
  });

  const handleChangePageNumber = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      table.setPageIndex(Number(e.target.value) - 1 || 0);
    },
    [table],
  );

  const handleDeleteRows = React.useCallback(() => {
    const selectedRows = table.getSelectedRowModel().flatRows;
    onDelete(selectedRows);
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    table.setRowSelection((oldRowState: RowSelectionState) => ({} as RowSelectionState));
  }, [table, onDelete]);

  return (
    <>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div>
                      {/* eslint-disable-next-line */}
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        className={styles.tableHeader}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, 10)
            .map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <div className={styles.buttonGroup}>
        <Button
          // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </Button>
        <Button
          // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </Button>
        <Button
          // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </Button>
        <Button
          // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </Button>
      </div>
      <div className={styles.buttonGroup}>
        <div className={styles.text}>
          {`Страница: ${
            table.getState().pagination.pageIndex + 1
          } из ${table.getPageCount()} | Перейти на страницу: `}
        </div>
        <div>
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={handleChangePageNumber}
            min={0}
            max={table.getPageCount()}
            className={mergedInputClassname}
          />
        </div>
      </div>
      <div className={styles.buttonGroup}>
        {`Выбрано строк: ${table.getSelectedRowModel().flatRows.length}`}
        <Button variant="filled" onClick={handleDeleteRows}>
          Удалить из таблицы
        </Button>
      </div>
    </>
  );
}

export default Table;
