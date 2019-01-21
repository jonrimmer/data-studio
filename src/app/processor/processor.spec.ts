import { processCsvFile } from "./processor";
import { ChartAndHistogramProcessor } from "./ChartAndHistogramProcessor";
import { StatsProcessor } from "./StatsProcessor";
import { async } from '@angular/core/testing';

const CSV1 = 
`A,B,C
0,1,2
1,1,3`

const CSV2 =
`A,B,C
0,X,1
2,Y,A`;

const CSV3 =
`A,B,C
0,1,2
3,4,5`;

const CSV4 =
`A,B
1,X
1,Y
2,X,
2,Y
2,Z`;

fdescribe('processCsvFile', () => {
  describe('StatsProcessor', () => {
    it ('should calculate the stats', async () => {
      const stats = new StatsProcessor(3);
      const statsResult = await processCsvFile(CSV1, { hasHeader: true, columns: [0, 1, 2], }, stats).toPromise();
  
      expect(statsResult.map(obj => ({...obj}))).toEqual([
        {
          index: 0,
          min: 0,
          max: 1,
          avg: 0.5,
          isAlphanumeric: false,
          isNumeric: true,
          uniqueValues: {
            numeric: 2,
            alphanumeric: 0,
            exceededLimit: false
          }
        }, {
          index: 1,
          min: 1,
          max: 1,
          avg: 1,
          isAlphanumeric: false,
          isNumeric: true,
          uniqueValues: {
            numeric: 1,
            alphanumeric: 0,
            exceededLimit: false
          }
        }, {
          index: 2,
          min: 2,
          max: 3,
          avg: 2.5,
          isAlphanumeric: false,
          isNumeric: true,
          uniqueValues: {
            numeric: 2,
            alphanumeric: 0,
            exceededLimit: false
          }
        }
      ]);
    });
  
    it('should detect non-numeric columns', async () => {
      const stats = new StatsProcessor(3);
      const statsResult = await processCsvFile(CSV2, { hasHeader: true, columns: [0, 1, 2] }, stats).toPromise();
  
      expect(statsResult.map(c => c.isNumeric)).toEqual([true, false, false]);
    });
  
    it('should skip excluded columns', async () => {
      const stats = new StatsProcessor(2);
      const statsResult = await processCsvFile(CSV3, { hasHeader: true, columns: [0, 2]}, stats).toPromise();
  
      expect(statsResult.map(c => c.min)).toEqual([0, 2]);
      expect(statsResult.map(c => c.max)).toEqual([3, 5]);
      expect(statsResult.map(c => c.avg)).toEqual([1.5, 3.5]);
    });  
  });

  describe('ChartAndHistogramProcessor', () => {
    it('should collect low-frequency numeric data into independent categories', async () => {
      const stats = new StatsProcessor(2);
      const statResult = await processCsvFile(CSV4, { hasHeader: true, columns: [0, 1]}, stats).toPromise();
  
      const chartsProcessor = new ChartAndHistogramProcessor(statResult);
  
      const charts = await processCsvFile(CSV4, { hasHeader: true, columns: [0, 1]}, chartsProcessor).toPromise();
      
      expect(charts).toEqual([[
        {
          label: '1',
          value: 2
        }, {
          label: '2',
          value: 3
        }
      ], [
        {
          label: 'X',
          value: 2
        }, {
          label: 'Y',
          value: 2
        }, {
          label: 'Z',
          value: 1
        }
      ]]);
    });

    it('should collect high-frequency numeric data into bins', async () => {
      const csv = 'A\n' + Array.from<{}, any>({ length: 101 }, (_, i) => i).join('\n');
      const stats = new StatsProcessor(1);

      const statResult = await processCsvFile(csv, { hasHeader: true, columns: [0] }, stats).toPromise();

      const chartsProcessor = new ChartAndHistogramProcessor(statResult);

      const charts = await processCsvFile(csv, { hasHeader: true, columns: [0] }, chartsProcessor).toPromise();

      expect(charts[0].length).toEqual(20);
      
      charts[0].forEach((category, i) => {
        expect(category.value).toEqual(i === 19 ? 6 : 5);
      });
    });
  });  
});
