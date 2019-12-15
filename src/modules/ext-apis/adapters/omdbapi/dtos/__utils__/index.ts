import { Expose, Transform } from 'class-transformer';

export const Rename = <OriginalType = any>(name: keyof OriginalType) => Expose({ name: name as any });

export const Default = (defaultValue: any, excludeValues = ['N/A']) =>
  Transform(value => {
    let result = value || defaultValue;

    if (excludeValues && excludeValues.length) {
      if (excludeValues.includes(result)) {
        result = defaultValue;
      }
    }

    return result;
  });
export const Split = (splitter = ',') => Transform((value: string) => value.split(splitter).map(i => i.trim()));

export const ParseInt = (defaultValue = 0, radix = 10) =>
  Transform(value => parseInt(String(value || defaultValue).replace(/,/g, ''), radix));

export const ParseFloat = (defaultValue = 0) =>
  Transform(value => parseFloat(String(value || defaultValue).replace(/,/g, '')));

export const ToDate = (defaultDateMs = 0) =>
  Transform(value => {
    let date = new Date(value);

    if (date.toString() === 'Invalid Date') {
      date = new Date(defaultDateMs);
    }

    return date;
  });
