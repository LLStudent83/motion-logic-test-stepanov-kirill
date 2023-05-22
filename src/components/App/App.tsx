import React from 'react';
import { Row } from '@tanstack/react-table';
// import Component from '../Components';
import styles from './App.module.scss';
import CustomSearchableSelect from '../CustomSearchableSelect/CustomSearchableSelect';
import useGetCities from '../../utils/useGetCities';
import { OptionT } from '../CustomSearchableSelect/Option';
import Button from '../Button/Button';
import Table from '../Table/Table';
import { CityT } from '../../types';

function App() {
  const cities = useGetCities();
  console.log('App rerenders');

  const [tableResults, setTableResults] = React.useState<CityT[]>([]);

  const ignoredOptions = React.useMemo(
    () => tableResults.map((item) => item.id || ''),
    [tableResults],
  );

  const options: OptionT[] = React.useMemo(
    () =>
      cities.map((item) => ({
        id: item.id || '',
        value: item.name || '',
        label: `${item.name}, ${item.subject}` || '',
      })),
    [cities],
  );

  const addToTable = React.useCallback(
    (selectOption: OptionT) => {
      const findCity = cities.find((item) => item.id === selectOption.id);
      if (findCity && !tableResults.includes(findCity)) {
        setTableResults([...tableResults, findCity]);
      }
    },
    [cities, tableResults, setTableResults],
  );

  const clearTable = React.useCallback(() => {
    setTableResults([]);
  }, [setTableResults]);

  const handleDeleteRows = React.useCallback(
    (selectedRows: Row<CityT>[]) => {
      setTableResults(
        tableResults.filter(
          (res) => !selectedRows.find((item) => item.original.id === res.id),
        ),
      );
    },
    [tableResults],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchGroup}>
        <CustomSearchableSelect
          options={options}
          ignoredOptions={ignoredOptions}
          onChange={addToTable}
          placeholder="Введите город для поиска"
          label="Введите город для поиска"
        />
        <Button variant="filled" onClick={clearTable}>
          Очистить таблицу
        </Button>
      </div>
      <Table data={tableResults} onDelete={handleDeleteRows} />
    </div>
  );
}

export default App;

/*
1. useGetCities нут обработки ошибки с бека в в 11 строке. Попросить расссказать
как можно обработать ошибку
2. App строка 18 для чего проверка "item.id || ''"
3. Для чего применяется useCallback в 32 строке
4. Что будет если забыть указать зависимость в useCallack
5. Какие пути оптимизации useEffect вы знаете
6. Для чего в Button "Button.defaultProps"
*/
