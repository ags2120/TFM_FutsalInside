import { Pipe, PipeTransform } from '@angular/core';
import { FormResult } from '../../core/models/standings.model';

const FORM_LABELS: Record<FormResult, string> = {
  W: 'V',
  D: 'E',
  L: 'D',
};

const FORM_CLASSES: Record<FormResult, string> = {
  W: 'win',
  D: 'draw',
  L: 'loss',
};

@Pipe({
  name: 'formLabel',
})
export class FormLabelPipe implements PipeTransform {
  transform(result: FormResult): string {
    return FORM_LABELS[result] ?? '';
  }
}

@Pipe({
  name: 'formClass',
})
export class FormClassPipe implements PipeTransform {
  transform(result: FormResult): string {
    return FORM_CLASSES[result] ?? '';
  }
}
