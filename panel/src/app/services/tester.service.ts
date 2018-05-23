import { Injectable, EventEmitter } from '@angular/core';

import { EditorModelService } from './editor-model.service';
import { BackendService } from './backend.service';


export enum TesterStates {
  Idle,
  Playing,
  Paused,
  Recording,
}

@Injectable()
export class TesterService {
  private _DT: number = .006;
  private _EARange: number = 0.1;

  public states = TesterStates;

  private _active : boolean = false;
  private _recording: any = undefined;
  private _inputs: any = {};
  private _state: TesterStates = TesterStates.Idle;
  private _playbackPosition: number = 0;
  private _playbackInterval: any;

  private _onActivated : EventEmitter<void> = new EventEmitter<void>();
  private _onDeactivated : EventEmitter<void> = new EventEmitter<void>();
  private _onMissingInput : EventEmitter<string> = new EventEmitter<string>();
  private _onRecording : EventEmitter<{inputs:any,}>
            = new EventEmitter<{inputs:any}>();
  private _onRecorded : EventEmitter<any> = new EventEmitter<any>();
  private _onRecordingFinished : EventEmitter<void> = new EventEmitter<void>();
  private _onRecordingFailed : EventEmitter<any> = new EventEmitter<any>();
  private _onPlay : EventEmitter<number> = new EventEmitter<number>();
  private _onPause : EventEmitter<number> = new EventEmitter<number>();
  private _onProgress : EventEmitter<number> = new EventEmitter<number>();


  constructor(
    private model : EditorModelService,
    private backend : BackendService,
  ) { }

  public activate() {
    this._active = true;
    this._onActivated.emit();
    return this;
  }

  public deactivate() {
    this._active = false;
    this._recording = undefined;
    this._playbackPosition = 0;
    clearInterval(this._playbackInterval);
    this._onDeactivated.emit();
    return this;
  }

  get missingInput(): string | undefined {
    for(let item of this.model.in.items) {
      if (!(item.label in this._inputs))
        return item.label;
    }

    return undefined;
  }

  public togglePlayback() {
    if (!this._recording) {
      this.pause();
      let missingInput = this.missingInput;

      if (!missingInput) {
        this._state = TesterStates.Recording;
        this._onRecording.emit({
          inputs: this._inputs,
        });

        this.backend.test(this._inputs).subscribe(response => {
          this._onRecordingFinished.emit();

          if (response.recording) {
            this._recording = response.recording;
            console.log(this._recording);
            this._onRecorded.emit(response.recording);
            this.play();
          }
          else {
            this._onRecordingFailed.emit(response);
            this._recording = undefined;
            this._state = TesterStates.Idle;
          }
        });
      }
      else {
        this._state = TesterStates.Idle;
        this.onMissingInput.emit(missingInput);
      }
    }
    else {
      if (this._state == TesterStates.Playing) this.pause();
      else this.play();
    }
  }

  public play() {
    if (this._state != TesterStates.Playing && this._recording) {
      this._state = TesterStates.Playing;
      this._onPlay.emit(this._playbackPosition);
      if (this._playbackPosition >= this.duration)
        this._playbackPosition = 0;
      clearInterval(this._playbackInterval);
      this._playbackInterval = setInterval(() => this.progress(), 10);
    }

    return this;
  }

  public pause() {
    if (this._state == TesterStates.Playing) {
      this._state = TesterStates.Paused;
      this._onPause.emit(this._playbackPosition);
      clearInterval(this._playbackInterval);
    }

    return this;
  }

  public forward(times: number = 2) {
    this.playbackPosition += this._DT * times;
  }

  public backward(times: number = 2) {
    this.playbackPosition -= this._DT * times;
  }

  private progress() {
    if (this._playbackPosition >= this.duration) {
      this.pause();
    }
    else {
      this._playbackPosition += this._DT;
      this._onProgress.emit(this._playbackPosition);
    }
  }

  public get state() { return this._state; }
  public get active() { return this._active; }
  public get recording() { return this._recording; }

  public get playbackPosition() { return this._playbackPosition; }
  public set playbackPosition(val) {
    this._playbackPosition = val;
    this.normalizePlaybackPosition();
  }

  public normalizePlaybackPosition() {
    if (this._playbackPosition >= this.duration) this._playbackPosition = this.duration;
    if (this._playbackPosition <= 0) this._playbackPosition = 0;
  }

  public get duration() {
    if (!this.recording) return 0;
    else {
      let recording = this.recording;
      return recording[recording.length - 1].time;
    }
  }

  public get playbackPercentage() {
    if (this.duration > 0) {
      return this.playbackPosition / this.duration;
    }
    else return 0;
  }

  public get events() {
    if (this.recording)
      return this.recording.filter(
      event =>
        event.time >= this._playbackPosition - this._EARange/2
        && event.time <= this._playbackPosition + this._EARange/2
      );
    else return [];
  }

  public getInput(label: string) {
    if (label in this._inputs)
      return JSON.stringify(this._inputs[label]);
    else
      return "";
  }

  public setInput(label: string, code: string) {
    try {
      this._inputs[label] = JSON.parse(code);
    }
    catch(err) {
      this._inputs[label] = code;
    }
  }

  public cleanUp() {
    this._inputs = {};
  }

  public get onActivated() { return this._onActivated; }
  public get onDeactivated() { return this._onDeactivated; }
  public get onMissingInput() { return this._onMissingInput; }
  public get onRecording() { return this._onRecording; }
  public get onRecorded() { return this._onRecorded; }
  public get onRecordingFinished() { return this._onRecordingFinished; }
  public get onRecordingFailed() { return this._onRecordingFailed; }
  public get onPlay() { return this._onPlay; }
  public get onPause() { return this._onPause; }
  public get onProgress() { return this._onProgress; }
}
