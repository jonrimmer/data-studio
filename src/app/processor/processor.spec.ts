import { processCsvFile, StatsProcessor, ChartAndHistogramProcessor } from "./processor";

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
    it ('should calculate the stats', () => {
      const stats = new StatsProcessor(3);
      processCsvFile(CSV1, { hasHeader: true, columns: [0, 1, 2], }, stats);
  
      expect(stats.columns.map(obj => ({...obj}))).toEqual([
        {
          index: 0,
          min: 0,
          max: 1,
          avg: 0.5,
          isNumeric: true,
          uniqueValues: {
            numeric: 2,
            alphanumeric: 0
          }
        }, {
          index: 1,
          min: 1,
          max: 1,
          avg: 1,
          isNumeric: true,
          uniqueValues: {
            numeric: 1,
            alphanumeric: 0
          }
        }, {
          index: 2,
          min: 2,
          max: 3,
          avg: 2.5,
          isNumeric: true,
          uniqueValues: {
            numeric: 2,
            alphanumeric: 0
          }
        }
      ]);
    });
  
    it('should detect non-numeric columns', () => {
      const stats = new StatsProcessor(3);
      processCsvFile(CSV2, { hasHeader: true, columns: [0, 1, 2] }, stats);
  
      expect(stats.columns.map(c => c.isNumeric)).toEqual([true, false, false]);
    });
  
    it('should skip excluded columns', () => {
      const stats = new StatsProcessor(2);
      processCsvFile(CSV3, { hasHeader: true, columns: [0, 2]}, stats);
  
      expect(stats.columns.map(c => c.min)).toEqual([0, 2]);
      expect(stats.columns.map(c => c.max)).toEqual([3, 5]);
      expect(stats.columns.map(c => c.avg)).toEqual([1.5, 3.5]);
    });  
  });

  describe('ChartAndHistogramProcessor', () => {
    it('should collect low-frequency numeric data into independent categories', () => {
      const stats = new StatsProcessor(2);
      processCsvFile(CSV4, { hasHeader: true, columns: [0, 1]}, stats);
  
      const charts = new ChartAndHistogramProcessor(stats.columns);
  
      processCsvFile(CSV4, { hasHeader: true, columns: [0, 1]}, charts);
  
      expect(Array.from(charts.columns[0].data.entries())).toEqual([
        ['1', 2],
        ['2', 3]
      ]);
  
      expect(Array.from(charts.columns[1].data.entries())).toEqual([
        ['X', 2],
        ['Y', 2],
        ['Z', 1]
      ]);
    });

    fit('should collect high-frequency numeric data into bins', () => {
      const csv = 'A\n' + Array.from<{}, any>({ length: 101 }, (_, i) => i).join('\n');
      const stats = new StatsProcessor(1);

      processCsvFile(csv, { hasHeader: true, columns: [0] }, stats);

      const charts = new ChartAndHistogramProcessor(stats.columns);

      processCsvFile(csv, { hasHeader: true, columns: [0] }, charts);

      expect(charts.columns[0].data.size).toEqual(20);
      
      Array.from(charts.columns[0].data.entries()).forEach(([ _, value ], i) => {
        expect(value).toEqual(i === 19 ? 6 : 5);
      });
    });
  });  
});
