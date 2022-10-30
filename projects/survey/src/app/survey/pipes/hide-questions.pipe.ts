import {Pipe, PipeTransform} from '@angular/core';
import {SurveyQuestion} from '../survey.service';

@Pipe({name: 'hideQuestions'})
export class HideQuestionsPipe implements PipeTransform {
  transform(value: SurveyQuestion[]): SurveyQuestion[] | null {
    const questions = value.filter((v) => !!v.question);
    return questions.length ? questions : null;
  }
}
