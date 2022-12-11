import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {SidenavComponent, SidenavComponentMessage, ProcessingMessage, MenuMessage, CloseMessage} from 'sidenav-stack';
import {UntypedFormGroup} from '@angular/forms';
import {FieldBase, InputField} from 'dynamic-form';
import {saveMenuButton} from '../../../../core/util/consts';
import {SignatureBlockService} from '../../../../core/services/signature-block.service';
import {SignatureBlock} from '../../../../models/signature.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {EmailActions} from '../../store/actions/action-types';
import {BehaviorSubject, combineLatest} from 'rxjs';

@Component({
  selector: 'app-signature-editor',
  templateUrl: './signature-editor.component.html',
  styleUrls: ['./signature-editor.component.scss']
})
export class SignatureEditorComponent implements SidenavComponent, OnInit {
  @Output() public controlMsg = new EventEmitter<SidenavComponentMessage>(true);
  @Input() public signatureId: string | undefined;
  public form = new UntypedFormGroup({});
  public fields: FieldBase<any>[][] = [
    [
      new InputField({
        key: 'title',
        label: 'Signature Name',
        required: true,
      })
    ]
  ];
  public signature = '';
  public signatureChange$ = new BehaviorSubject<void>(void 0);
  constructor(
    private dataService: SignatureBlockService,
    private store: Store<AppState>,
  ) { }
  public ngOnInit() {
    if (this.signatureId) {
      this.controlMsg.emit(new ProcessingMessage(true));
      this.dataService.getOne(this.signatureId)
        .subscribe((model) => {
          this.controlMsg.emit(new ProcessingMessage(false));
          this.signature = model.signature;
          this.form.patchValue(model);
        }, () => this.controlMsg.emit(new ProcessingMessage(false)));
    }
    const saveBtn = saveMenuButton(() => this.save(), true);
    const menu = [saveBtn];
    this.controlMsg.emit(new MenuMessage(menu));
    combineLatest([this.signatureChange$, this.form.statusChanges])
      .subscribe(([, status]) => {
        saveBtn.disabled = !this.signature || status !== 'VALID';
        this.controlMsg.emit(new MenuMessage(menu));
      });
  }
  private save(): void {
    const signature: Partial<SignatureBlock> = {
      ...this.form.value,
      signature: this.signature,
      id: this.signatureId,
    };
    this.controlMsg.emit(new ProcessingMessage(true));
    this.dataService.save(signature).subscribe((res) => {
      if (!signature.id) {
        this.store.dispatch(EmailActions.addEmailSignature({signature: res}));
      } else {
        this.store.dispatch(EmailActions.updateEmailSignature({signature: res}));
      }
      this.controlMsg.emit(new CloseMessage(res));
    }, () => this.controlMsg.emit(new ProcessingMessage(false)));
  }
}
