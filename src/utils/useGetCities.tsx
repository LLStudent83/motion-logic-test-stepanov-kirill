import React, { useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import getCities from './getCities';
import { CityT } from '../types';

const useGetCities = () => {
  const [cities, setCities] = React.useState<CityT[]>([]);

  React.useEffect(() => {
    getCities().then((data) => {
      setCities(data);
    });
  }, []);

  // const memoCities = useMemo(() => {
  //   // console.log('сработал memo');
  //   const newCities = cities.map((item) => {
  //     // eslint-disable-next-line no-param-reassign
  //     item.id = uuid();

  //     return item;
  //   });
  //   return newCities;
  // }, [cities]);

  // console.log('cities', cities);
  return cities.map((item) => {
    // eslint-disable-next-line no-param-reassign
    item.id = uuid();

    return item;
  });

  // return memoCities;
};

export default useGetCities;
