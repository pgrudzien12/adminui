import {
  Component,
  OnDestroy,
  Renderer2,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-json-comparison',
  templateUrl: './json-comparison.component.html',
  styleUrls: ['./json-comparison.component.css'],
})
export class JsonComparisonComponent implements OnDestroy, AfterViewInit {
  @Input() leftTree: any;
  @Input() rightTree: any;
  @Input() hideInitialStep: boolean = true;
  @Input() hideReport: boolean = true;
  @Output() differenceReport: EventEmitter<any> = new EventEmitter();
  @ViewChild('compare') elementRef: ElementRef;
  reportData: any;
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.addDiffFiles();
  }

  emitReportData(data) {
    if (data) {
      this.reportData = JSON.parse(data);
    } else {
      this.reportData = {
        incorrectTypes: 0,
        missingProperties: 0,
        totalDiffCount: 0,
        unequalValues: 0,
      };
    }
    this.differenceReport.emit(this.reportData);
  }

  addDiffFiles() {
    this.addCssToElement('assets/jdd-resources/styles/throbber.css');
    this.addCssToElement('assets/jdd-resources/styles/jdd.css');
    new Observable((res) => {
      this.addJsToElement(
        'assets/jdd-resources/js-files/jQuery.min.js'
      ).onload = () => {
        return res.next();
      };
    }).subscribe(() => {
      this.addJsToElement(
        'assets/jdd-resources/js-files/jsl.format.js'
      ).onload = () => {
        this.addJsToElement('assets/jdd-resources/js-files/jsl.parser.js');
        this.addJsToElement('assets/jdd-resources/js-files/jdd.js');

        this.renderer.listen(this.elementRef.nativeElement, 'click', () => {
          setTimeout(() => {
            this.emitReportData(
              (document.getElementById('reportData') as HTMLInputElement)
                .innerHTML
            );
          }, 10);
        });
      };
    });
  }

  addCssToElement(src: string) {
    const headID = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.media = 'screen';
    link.href = src;
    headID.appendChild(link);
  }

  addJsToElement(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = src;
    this.renderer.appendChild(document.body, script);
    return script;
  }

  deleteDiffFiles() {
    const scripts = document.getElementsByTagName('script');
    let i = scripts.length;
    while (i--) {
      if (
        scripts[i].src.includes(
          'assets/jdd-resources/js-files/jQuery.min.js'
        ) ||
        scripts[i].src.includes(
          'assets/jdd-resources/js-files/jsl.format.js'
        ) ||
        scripts[i].src.includes(
          'assets/jdd-resources/js-files/jsl.parser.js'
        ) ||
        scripts[i].src.includes('assets/jdd-resources/js-files/jdd.js')
      ) {
        scripts[i].parentNode.removeChild(scripts[i]);
      }
    }

    const styles = window.document.getElementsByTagName('link');
    let j = styles.length;
    while (j--) {
      // console.log(styles[j].href);
      if (
        styles[j].href.includes('assets/jdd-resources/styles/reset.css') ||
        styles[j].href.includes('assets/bpmn/bpmn-resources/styles/jdd.css') ||
        styles[j].href.includes(
          'assets/bpmn/bpmn-resources/styles/throbber.css'
        )
      ) {
        styles[j].parentNode.removeChild(styles[j]);
      }
    }
  }

  ngOnDestroy() {
    this.deleteDiffFiles();
  }
}
