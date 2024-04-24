import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDateRangeSelectionStrategy, DateRange } from '@angular/material/datepicker';

@Injectable()
export class MonthRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private dateAdapter: DateAdapter<D>) { }
  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = date;
      const end = this.dateAdapter.addCalendarDays(date, this.dateAdapter.getNumDaysInMonth(date) - this.dateAdapter.getDate(date));
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}
